import { Controller, Get } from '@nestjs/common';
import { LocationService } from './location.services';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getLocations() : any{
    return this.locationService.getLocations();
  }
}
