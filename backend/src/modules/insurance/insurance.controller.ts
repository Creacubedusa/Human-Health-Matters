import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoverageVerificationRequestDto } from './dto/coverage.dto';

@ApiTags('insurance')
@Controller('insurance')
export class InsuranceController {
  @Post('verify')
  async verify(@Body() body: CoverageVerificationRequestDto) {
    return {
      outcome: 'insuredFull',
      scenarioId: body.scenarioId,
      path: body.path,
      insuranceStatus: 'active',
      eligibilityStatus: body.path === 'donor' ? 'eligible' : 'unknown',
      donorAvailability: 'available',
      coveragePercent: 100,
      consultationCost: 100,
      insurancePays: 100,
      patientCopay: 0,
      donorCovers: 0,
      finalYouPay: 0,
      outOfPocketBalance: 0,
      donorAvailableAmount: 0,
      patientName: 'Angela Dairo',
      memberId: 'U98765432100',
      groupNumber: '0123456',
      planType: 'PPO Plus',
      telehealthCoverage: 'Covered',
      carrierLabel: 'United Healthcare',
      networkStatus: 'In-network',
      deductible: '$75 out of $100',
      referralRequired: 'No',
      priorAuthorizationRequired: 'No',
      rxCoverage: 'Yes — included',
      secondaryActions: [],
      canBookConsultation: true,
    };
  }
}
