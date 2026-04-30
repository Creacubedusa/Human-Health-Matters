import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ComputeTriageDto } from './dto/triage.dto';

@ApiTags('triage')
@Controller('triage')
export class TriageController {
  @Post('compute')
  async compute(@Body() body: ComputeTriageDto) {
    return {
      severity: 'low',
      summary: 'Based on your symptoms, your condition appears mild.',
      nextSteps: [
        {
          title: 'Rest and Hydrate',
          description: 'Get adequate rest and stay well hydrated.',
        },
      ],
      sessionId: body.sessionId,
      matchingContext: {
        symptoms: ['chest tightness', 'fatigue'],
        history: ['hypertension'],
        urgency: 'urgent',
        coverageStatus: 'eligible',
        donorFund: 'available',
      },
    };
  }

  @Get('history')
  async history() {
    return [
      {
        id: 'h1',
        title: 'Chest Pressure',
        description: 'Based on this symptoms',
        date: 'Dec 12, 2024',
        severity: 'emergency',
      },
    ];
  }

  @Post('wishlist')
  async wishlist() {
    return { ok: true };
  }
}
