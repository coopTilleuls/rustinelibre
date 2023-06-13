<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230613134029 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add latitude and longitude in appointments';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD latitude VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE appointment ADD longitude VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment DROP latitude');
        $this->addSql('ALTER TABLE appointment DROP longitude');
    }
}
