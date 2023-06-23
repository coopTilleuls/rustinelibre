<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230619140822 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add comment in appointment table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD comment TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment DROP comment');
    }
}
