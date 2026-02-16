import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1771279287354 implements MigrationInterface {
    name = 'InitialSchema1771279287354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`inventory\` (\`id\` varchar(36) NOT NULL, \`resource_name\` varchar(255) NOT NULL, \`total_stock\` int NOT NULL DEFAULT '0', \`available_stock\` int NOT NULL DEFAULT '0', \`version\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_18fc6efc5b722aa6621c53108d\` (\`resource_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookings\` (\`id\` varchar(36) NOT NULL, \`inventory_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'FAILED') NOT NULL DEFAULT 'PENDING', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`bookings\``);
        await queryRunner.query(`DROP INDEX \`IDX_18fc6efc5b722aa6621c53108d\` ON \`inventory\``);
        await queryRunner.query(`DROP TABLE \`inventory\``);
    }

}
