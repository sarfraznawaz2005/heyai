import { runCommand } from '../commands/run';
import { checkCommand } from '../commands/check';
import { configManager } from '../config';

// Mock dependencies
jest.mock('../config');
jest.mock('../commands/run');
jest.mock('../executor', () => ({
  executeCommand: jest.fn(),
  executeCommandSilent: jest.fn()
}));

const mockExecuteCommandSilent = require('../executor').executeCommandSilent;

const mockConfigManager = configManager as jest.Mocked<typeof configManager>;
const mockRunTool = require('../commands/run').runTool;
const mockExecuteCommand = require('../executor').executeCommand;

describe('Execution Commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });



  describe('Check Command', () => {
    it('should benchmark all tools', async () => {
      const mockTools = [
        {
          name: 'tool1',
          command: 'cmd1',
          description: 'desc1',
          time_taken: null,
          last_ran: null,
          okay: null
        },
        {
          name: 'tool2',
          command: 'cmd2',
          description: 'desc2',
          time_taken: null,
          last_ran: null,
          okay: null
        }
      ];

      mockConfigManager.getTools.mockReturnValue(mockTools);
      mockExecuteCommandSilent.mockResolvedValue({
        success: true,
        timeTaken: 1.0
      });

      await checkCommand();
      expect(mockExecuteCommandSilent).toHaveBeenCalledTimes(2);
      expect(mockConfigManager.updateTool).toHaveBeenCalledTimes(2);
      expect(mockConfigManager.setBest).toHaveBeenCalledWith('tool1'); // Fastest tool
    });

    it('should skip disabled tools by default', async () => {
      const mockTools = [
        {
          name: 'enabled',
          command: 'cmd1',
          description: 'enabled tool',
          time_taken: null,
          last_ran: null,
          okay: null,
          disabled: false
        },
        {
          name: 'disabled',
          command: 'cmd2',
          description: 'disabled tool',
          time_taken: null,
          last_ran: null,
          okay: null,
          disabled: true
        }
      ];

      mockConfigManager.getTools.mockReturnValue(mockTools);
      mockExecuteCommandSilent.mockResolvedValue({
        success: true,
        timeTaken: 1.0
      });

      await checkCommand();
      expect(mockExecuteCommandSilent).toHaveBeenCalledTimes(1); // Only enabled tool
      expect(mockExecuteCommandSilent).toHaveBeenCalledWith('cmd1', 'hello', false);
    });

    it('should include disabled tools when --include-disabled is used', async () => {
      const mockTools = [
        {
          name: 'enabled',
          command: 'cmd1',
          description: 'enabled tool',
          time_taken: null,
          last_ran: null,
          okay: null,
          disabled: false
        },
        {
          name: 'disabled',
          command: 'cmd2',
          description: 'disabled tool',
          time_taken: null,
          last_ran: null,
          okay: null,
          disabled: true
        }
      ];

      mockConfigManager.getTools.mockReturnValue(mockTools);
      mockExecuteCommandSilent.mockResolvedValue({
        success: true,
        timeTaken: 1.0
      });

      await checkCommand({ includeDisabled: true });
      expect(mockExecuteCommandSilent).toHaveBeenCalledTimes(2); // Both tools
    });
  });
});