<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230713072846 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Keep forgot password token';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" ADD forgot_password_token VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" DROP forgot_password_token');
    }
}
