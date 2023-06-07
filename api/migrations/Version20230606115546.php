<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230606115546 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add user address';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" ADD street VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD city VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP street');
        $this->addSql('ALTER TABLE "user" DROP city');
    }
}
