import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bonus } from 'src/entities/bonus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bonus])],
  exports: [TypeOrmModule]
})
export class BonusModule {}