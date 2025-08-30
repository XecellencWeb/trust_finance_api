import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface AdminConfiguration {
  wallets: Record<
    string,
    {
      network: string;
      address: string;
      minDeposit: number;
      icon: string;
      depositNote: string;
    }
  >;
  depositInstructions: {
    en: string;
    supportEmail: string;
    confirmationTime: string;
  };
  feeSettings: {
    depositFeePercent: number;
    withdrawalFeePercent: number;
  };
  adminMeta: {
    version: string;
    lastUpdated: string;
  };
}

@Injectable()
export class AdminConfigurationService {
  private configurationPath = path.join(
    process.cwd(),
    'data/admin-configuration.json',
  );
  private configuration: AdminConfiguration;

  constructor() {
    this.configuration = this.readConfigFile();
  }

  /**
   * Read the config file
   */
  private readConfigFile(): AdminConfiguration {
    try {
      const raw = fs.readFileSync(this.configurationPath, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to load configuration file.',
      );
    }
  }

  /**
   * Save the current config state to file
   */
  private saveConfigFile(): void {
    try {
      this.configuration.adminMeta.lastUpdated = new Date().toISOString();
      fs.writeFileSync(
        this.configurationPath,
        JSON.stringify(this.configuration, null, 2),
        'utf-8',
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save configuration file.',
      );
    }
  }

  /**
   * Get entire config
   */
  getConfig(): AdminConfiguration {
    return this.configuration;
  }

  /**
   * Get a specific config key
   */
  getConfigKey<T = any>(key: keyof AdminConfiguration): T {
    return this.configuration[key] as T;
  }

  /**
   * Update a specific config key (e.g., feeSettings, wallets, etc.)
   */
  updateConfigKey<T = any>(key: keyof AdminConfiguration, value: T): void {
    if (!(key in this.configuration)) {
      throw new NotFoundException(`Configuration key "${key}" not found`);
    }

    (this.configuration[key] as T) = value;
    this.saveConfigFile();
  }

  /**
   * Update a nested wallet address
   */
  updateWalletAddress(walletKey: string, address: string): void {
    if (!this.configuration.wallets[walletKey]) {
      throw new NotFoundException(`Wallet "${walletKey}" not found`);
    }

    this.configuration.wallets[walletKey].address = address;
    this.saveConfigFile();
  }

  getWalletAddress(walletKey: string): string {
    if (!this.configuration.wallets[walletKey]) {
      throw new NotFoundException(`Wallet "${walletKey}" not found`);
    }

    return this.configuration.wallets[walletKey].address;
  }
}
