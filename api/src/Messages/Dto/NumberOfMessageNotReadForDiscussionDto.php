<?php

declare(strict_types=1);

namespace App\Messages\Dto;

use App\Entity\Discussion;
use Symfony\Component\Serializer\Annotation\Groups;

final class NumberOfMessageNotReadForDiscussionDto
{
    public function __construct(
        #[Groups([Discussion::DISCUSSION_READ])]
        public Discussion $discussion,
        #[Groups([Discussion::DISCUSSION_READ])]
        public int $notRead,
    ) {
    }
}
