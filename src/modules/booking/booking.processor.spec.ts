import { Test, TestingModule } from '@nestjs/testing';
import { BookingProcessor } from './booking.processor';
import { BookingService } from './services/booking.service';
import { Job } from 'bullmq';
import { Booking, BookingStatus } from './entities/booking.entity';

describe('BookingProcessor', () => {
  let processor: BookingProcessor;
  let bookingService: jest.Mocked<BookingService>;

  beforeEach(async () => {
    const mockBookingService = {
      createBooking: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingProcessor,
        {
          provide: BookingService,
          useValue: mockBookingService,
        },
      ],
    }).compile();

    processor = module.get<BookingProcessor>(BookingProcessor);
    bookingService = module.get(BookingService);

    // Suppress console logs during testing
    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should process booking successfully', async () => {
      // Arrange
      const mockJob = {
        id: 'job-123',
        data: {
          resourceName: 'Room1',
          userId: 'user1',
          quantity: 2,
        },
      } as Job;

      const mockBooking = new Booking();
      mockBooking.id = 1;
      mockBooking.userId = mockJob.data.userId;
      mockBooking.quantity = mockJob.data.quantity;
      mockBooking.status = BookingStatus.CONFIRMED;

      bookingService.createBooking.mockResolvedValue(mockBooking);

      // Act
      const result = await processor.process(mockJob);

      // Assert
      expect(bookingService.createBooking).toHaveBeenCalledWith(
        mockJob.data.resourceName,
        mockJob.data.userId,
        mockJob.data.quantity,
      );
      expect(result).toEqual(mockBooking);
      expect(console.log).toHaveBeenCalledWith('[Queue] Reserva EXITOSA: job-123');
    });

    it('should throw an expected error if booking fails', async () => {
      // Arrange
      const mockJob = {
        id: 'job-123',
        data: {
          resourceName: 'Room1',
          userId: 'user1',
          quantity: 2,
        },
      } as Job;

      const errorMessage = 'Not enough stock';
      bookingService.createBooking.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(processor.process(mockJob)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalledWith(
        '[Queue] Reserva FALLIDA: job-123 - Not enough stock',
      );
    });

    it('should gracefully handle non-Error objects thrown', async () => {
      // Arrange
      const mockJob = {
        id: 'job-123',
        data: {
          resourceName: 'Room1',
          userId: 'user1',
          quantity: 2,
        },
      } as Job;

      bookingService.createBooking.mockRejectedValue('String error');

      // Act & Assert
      await expect(processor.process(mockJob)).rejects.toThrow('Unknown error');
      expect(console.error).toHaveBeenCalledWith(
        '[Queue] Reserva FALLIDA: job-123 - Unknown error',
      );
    });
  });
});
