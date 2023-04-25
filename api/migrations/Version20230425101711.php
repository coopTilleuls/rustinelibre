<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230425101711 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add maintenance table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE maintenance_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE maintenance (id INT NOT NULL, owner_id INT NOT NULL, bike_id INT NOT NULL, photo_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(3000) DEFAULT NULL, repair_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2F84F8E97E3C61F9 ON maintenance (owner_id)');
        $this->addSql('CREATE INDEX IDX_2F84F8E9D5A4816F ON maintenance (bike_id)');
        $this->addSql('CREATE INDEX IDX_2F84F8E93DA5256D ON maintenance (photo_id)');
        $this->addSql('COMMENT ON COLUMN maintenance.repair_date IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT FK_2F84F8E97E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT FK_2F84F8E9D5A4816F FOREIGN KEY (bike_id) REFERENCES bike (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT FK_2F84F8E93DA5256D FOREIGN KEY (photo_id) REFERENCES media_object (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE maintenance_id_seq CASCADE');
        $this->addSql('ALTER TABLE maintenance DROP CONSTRAINT FK_2F84F8E97E3C61F9');
        $this->addSql('ALTER TABLE maintenance DROP CONSTRAINT FK_2F84F8E9D5A4816F');
        $this->addSql('ALTER TABLE maintenance DROP CONSTRAINT FK_2F84F8E93DA5256D');
        $this->addSql('DROP TABLE maintenance');
    }
}
