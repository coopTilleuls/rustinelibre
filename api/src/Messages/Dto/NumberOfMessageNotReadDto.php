<?php

declare(strict_types=1);

namespace App\Messages\Dto;

use App\Entity\Discussion;
use Symfony\Component\Serializer\Annotation\Groups;

final class NumberOfMessageNotReadDto
{
    public function __construct(
        #[Groups([Discussion::DISCUSSION_READ])]
        /** @var NumberOfMessageNotReadForDiscussionDto[] $numberOfMessageNotReadByDiscussion */
        public array $numberOfMessageNotReadByDiscussion,
    ) {
    }
}
