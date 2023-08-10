<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\MediaObject;
use App\Repository\MediaObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PropertyInfo\Extractor\PhpDocExtractor;
use Symfony\Component\PropertyInfo\Extractor\ReflectionExtractor;
use Symfony\Component\PropertyInfo\PropertyInfoExtractor;

class RemoveMediaObjectEventSubscriber implements EventSubscriberInterface
{
    private PropertyInfoExtractor $propertyInfo;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly MediaObjectRepository $mediaObjectRepository
    ) {
        $phpDocExtractor = new PhpDocExtractor();
        $reflectionExtractor = new ReflectionExtractor();
        $listExtractors = [$reflectionExtractor];
        $typeExtractors = [$phpDocExtractor, $reflectionExtractor];
        $descriptionExtractors = [$phpDocExtractor];
        $accessExtractors = [$reflectionExtractor];
        $propertyInitializableExtractors = [$reflectionExtractor];
        $this->propertyInfo = new PropertyInfoExtractor(
            $listExtractors,
            $typeExtractors,
            $descriptionExtractors,
            $accessExtractors,
            $propertyInitializableExtractors
        );
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['removeMediaObject', EventPriorities::PRE_WRITE],
        ];
    }

    public function removeMediaObject(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (Request::METHOD_PUT !== $method) {
            return;
        }

        $propertiesWithMediaObject = [];
        $properties = $this->propertyInfo->getProperties($object::class);

        if (null === $properties) {
            return;
        }

        foreach ($properties as $property) {
            $types = $this->propertyInfo->getTypes($object::class, $property);
            if (null === $types) {
                continue;
            }
            foreach ($types as $type) {
                if (MediaObject::class === $type->getClassName()) {
                    $propertiesWithMediaObject[] = $property;
                }
            }
        }

        if (empty($propertiesWithMediaObject)) {
            return;
        }

        $originalEntity = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        foreach ($propertiesWithMediaObject as $property) {
            $snakeCaseProperty = sprintf('%s_id', $this->convertCamelCaseToSnakeCase($property));
            if (array_key_exists($snakeCaseProperty, $originalEntity)
                && $originalEntity[$snakeCaseProperty]
                && property_exists($object, $property)
                && $object->{$property}
                && $object->{$property}->id
                && $originalEntity[$snakeCaseProperty] !== $object->{$property}->id
            ) {
                $mediaObject = $this->mediaObjectRepository->find($originalEntity[$snakeCaseProperty]);
                if ($mediaObject) {
                    $this->mediaObjectRepository->remove($mediaObject);
                }
            }
        }
    }

    private function convertCamelCaseToSnakeCase(string $input): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $input));
    }
}
