<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230322153836 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE greeting_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE appointment_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE location_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE repairer_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE appointment (id INT NOT NULL, customer_id INT DEFAULT NULL, location_id INT NOT NULL, slot_time TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, duration INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_FE38F8449395C3F3 ON appointment (customer_id)');
        $this->addSql('CREATE INDEX IDX_FE38F84464D218E ON appointment (location_id)');
        $this->addSql('COMMENT ON COLUMN appointment.slot_time IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE location (id INT NOT NULL, repairer_id INT NOT NULL, street VARCHAR(800) DEFAULT NULL, city VARCHAR(255) NOT NULL, postcode VARCHAR(255) DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, rrule VARCHAR(255) NOT NULL, minimum_preparation_delay INT NOT NULL, latitude VARCHAR(255) DEFAULT NULL, longitude VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5E9E89CB47C5DFEE ON location (repairer_id)');
        $this->addSql('CREATE TABLE repairer (id INT NOT NULL, owner_id INT NOT NULL, description TEXT DEFAULT NULL, mobile_phone VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4A73F2BF7E3C61F9 ON repairer (owner_id)');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F8449395C3F3 FOREIGN KEY (customer_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F84464D218E FOREIGN KEY (location_id) REFERENCES location (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE location ADD CONSTRAINT FK_5E9E89CB47C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BF7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP TABLE greeting');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE appointment_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE location_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE repairer_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE greeting_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE greeting (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F8449395C3F3');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F84464D218E');
        $this->addSql('ALTER TABLE location DROP CONSTRAINT FK_5E9E89CB47C5DFEE');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BF7E3C61F9');
        $this->addSql('DROP TABLE appointment');
        $this->addSql('DROP TABLE location');
        $this->addSql('DROP TABLE repairer');
    }
}
