import { addCommand } from '../commands/add';
import { configManager } from '../config';

// Mock dependencies
jest.mock('../config');
jest.mock('inquirer', () => ({
  prompt: jest.fn()
}));

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });

const mockConfigManager = configManager as jest.Mocked<typeof configManager>;
const mockInquirer = require('inquirer');

describe('Add Command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigManager.toolExists.mockReturnValue(false);
    mockConfigManager.addTool.mockReturnValue(undefined);
  });

  it('should add tool with all options provided', async () => {
    const options = {
      name: 'testtool',
      command: 'test command',
      description: 'test description'
    };

    await addCommand(options);
    expect(mockConfigManager.toolExists).toHaveBeenCalledWith('testtool');
    expect(mockConfigManager.addTool).toHaveBeenCalledWith({
      name: 'testtool',
      command: 'test command',
      description: 'test description',
      time_taken: null,
      last_ran: null,
      okay: null
    });
  });

  it('should fail if tool name already exists', async () => {
    mockConfigManager.toolExists.mockReturnValue(true);
    const options = {
      name: 'existingtool',
      command: 'test command',
      description: 'test description'
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await expect(addCommand(options)).rejects.toThrow('process.exit called');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('already exists'));
    consoleSpy.mockRestore();
  });

  it('should prompt for missing options in interactive mode', async () => {
    const mockAnswers = {
      name: 'interactivetool',
      command: 'interactive command',
      description: 'interactive description'
    };

    mockInquirer.prompt.mockResolvedValue(mockAnswers);

    const options = { name: 'interactivetool' }; // Missing command and description

    await addCommand(options);
    expect(mockInquirer.prompt).toHaveBeenCalled();
    expect(mockConfigManager.addTool).toHaveBeenCalledWith({
      name: 'interactivetool',
      command: 'interactive command',
      description: 'interactive description',
      time_taken: null,
      last_ran: null,
      okay: null
    });
  });

  it('should handle user cancellation in interactive mode', async () => {
    mockInquirer.prompt.mockRejectedValue(new Error('User cancelled'));

    const options = {}; // No options provided

    await addCommand(options);
    expect(mockInquirer.prompt).toHaveBeenCalled();
    expect(mockConfigManager.addTool).not.toHaveBeenCalled();
  });
});