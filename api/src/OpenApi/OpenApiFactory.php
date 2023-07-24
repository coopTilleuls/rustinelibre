<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\OpenApi\OpenApi;

class OpenApiFactory implements OpenApiFactoryInterface
{
    public function __construct(private readonly OpenApiFactoryInterface $decorated)
    {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        $authOperation = new Model\Operation('/auth');
        $authOperation = $authOperation
            ->withSummary('Creates a JWT token to access to Api')
            ->withOperationId('login_check_post')
            ->withTags(['Login Check'])
            ->withSecurity([['Bearer Token' => []]])
            ->withDescription('Creates a JWT token with credentials to access to Api')
            ->withResponses([
                '200' => new Model\Response('Token created', new \ArrayObject([
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'token' => [
                                    'type' => 'string',
                                    'example' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                                ],
                                'refresh_token' => [
                                    'type' => 'string',
                                    'example' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                                ],
                            ],
                        ],
                    ],
                ])),
                '401' => new Model\Response('Unauthorized', new \ArrayObject([
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'error' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'code' => [
                                            'type' => 'integer',
                                            'example' => 401,
                                        ],
                                        'message' => [
                                            'type' => 'string',
                                            'example' => 'Invalid credentials.',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ])),
                '422' => new Model\Response('Unprocessable entity'),
                '429' => new Model\Response('Too many requests'),
        ]);

        $pathItem = new Model\PathItem();
        $pathItem = $pathItem->withPost($authOperation);
        $openApi->getPaths()->addPath('/auth', $pathItem);

        return $openApi;
    }
}
