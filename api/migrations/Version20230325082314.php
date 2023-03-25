<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230325082314 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE bike_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE bike_type (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE repairer ADD name VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ALTER city DROP NOT NULL');
        $this->addSql('ALTER TABLE repairer ALTER rrule DROP NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE bike_type_id_seq CASCADE');
        $this->addSql('DROP TABLE bike_type');
        $this->addSql('ALTER TABLE repairer DROP name');
        $this->addSql('ALTER TABLE repairer ALTER city SET NOT NULL');
        $this->addSql('ALTER TABLE repairer ALTER rrule SET NOT NULL');
    }
}
