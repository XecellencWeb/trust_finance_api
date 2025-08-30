import { Module } from '@nestjs/common';
import { AdminConfigurationService } from './admin-configuration.service';
import { AdminConfigurationController } from './admin-configuration.controller';

@Module({
  providers: [AdminConfigurationService],
  controllers: [AdminConfigurationController],
  exports: [AdminConfigurationService],
})
export class AdminConfigurationModule {}
