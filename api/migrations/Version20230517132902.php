<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230517132902 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add bike infos in appointment table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD bike_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE appointment ADD bike_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F844D5A4816F FOREIGN KEY (bike_id) REFERENCES bike (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment ADD CONSTRAINT FK_FE38F8447FF015AE FOREIGN KEY (bike_type_id) REFERENCES bike_type (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_FE38F844D5A4816F ON appointment (bike_id)');
        $this->addSql('CREATE INDEX IDX_FE38F8447FF015AE ON appointment (bike_type_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F844D5A4816F');
        $this->addSql('ALTER TABLE appointment DROP CONSTRAINT FK_FE38F8447FF015AE');
        $this->addSql('DROP INDEX IDX_FE38F844D5A4816F');
        $this->addSql('DROP INDEX IDX_FE38F8447FF015AE');
        $this->addSql('ALTER TABLE appointment DROP bike_id');
        $this->addSql('ALTER TABLE appointment DROP bike_type_id');
    }
}
