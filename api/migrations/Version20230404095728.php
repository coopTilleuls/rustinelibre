<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230404095728 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repairer ADD profile_picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD page_picture VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD speciality VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD opening_hours TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD delivery_description VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD delivery_price NUMERIC(6, 2) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD optional_page TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP profile_picture');
        $this->addSql('ALTER TABLE repairer DROP page_picture');
        $this->addSql('ALTER TABLE repairer DROP speciality');
        $this->addSql('ALTER TABLE repairer DROP opening_hours');
        $this->addSql('ALTER TABLE repairer DROP delivery_description');
        $this->addSql('ALTER TABLE repairer DROP delivery_price');
        $this->addSql('ALTER TABLE repairer DROP optional_page');
    }
}
