<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230428192359 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Set repairer description picture null if deleted';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BF51A96A7E');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BF51A96A7E FOREIGN KEY (description_picture_id) REFERENCES media_object (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT fk_4a73f2bf51a96a7e');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT fk_4a73f2bf51a96a7e FOREIGN KEY (description_picture_id) REFERENCES media_object (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }
}
