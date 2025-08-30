// src/admin-config/admin-configuration.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AdminConfigurationService } from './admin-configuration.service';
import { AdminJwtGuard } from 'src/auth/guards/admin-jwt.guard';

@Controller('admin/config')
export class AdminConfigurationController {
  constructor(private readonly configService: AdminConfigurationService) {}

  /**
   * Get full config
   */
  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  /**
   * Get a single config section (e.g., feeSettings, depositInstructions)
   */
  @UseGuards(AdminJwtGuard)
  @Get(':key')
  getConfigKey(@Param('key') key: string) {
    const allowedKeys = [
      'wallets',
      'feeSettings',
      'depositInstructions',
      'adminMeta',
    ];

    if (!allowedKeys.includes(key)) {
      throw new NotFoundException(`Invalid config key: ${key}`);
    }

    return this.configService.getConfigKey(key as any);
  }

  @Get('wallet-address/:walletKey')
  getWalletAddress(@Param('walletKey') walletKey: string) {
    return this.configService.getWalletAddress(walletKey);
  }

  /**
   * Update a full config section (e.g., feeSettings, depositInstructions)
   */
  @UseGuards(AdminJwtGuard)
  @Patch(':key')
  updateConfigSection(@Param('key') key: string, @Body() payload: any) {
    const allowedKeys = [
      'wallets',
      'feeSettings',
      'depositInstructions',
      'adminMeta',
    ];

    if (!allowedKeys.includes(key)) {
      throw new BadRequestException(`Cannot update key: ${key}`);
    }

    this.configService.updateConfigKey(key as any, payload);
    return { message: `Updated ${key} successfully.` };
  }

  /**
   * Update a specific wallet address only
   */
  @Patch('wallets/:walletKey/address')
  updateWalletAddress(
    @Param('walletKey') walletKey: string,
    @Body('address') address: string,
  ) {
    if (!address || typeof address !== 'string') {
      throw new BadRequestException('A valid address is required.');
    }

    this.configService.updateWalletAddress(walletKey, address);
    return { message: `Wallet ${walletKey} address updated.` };
  }
}
