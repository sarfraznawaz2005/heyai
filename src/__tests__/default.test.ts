import { defaultCommand } from '../commands/default';
import { configManager } from '../config';
import { runTool } from '../commands/run';

// Mock dependencies
jest.mock('../config', () => {
  return {
    configManager: {
      getBest: jest.fn(),
      getTools: jest.fn(),
      updateTool: jest.fn(),
      setBest: jest.fn(),
    }
  };
});

jest.mock('../commands/run');

const mockConfigManager = require('../config').configManager;
const mockRunTool = runTool as jest.MockedFunction<typeof runTool>;

describe('Default Command', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock basic config manager methods
    mockConfigManager.getBest.mockReturnValue('test-tool');
    mockConfigManager.getTools.mockReturnValue([]);
    mockConfigManager.updateTool.mockReturnValue(true);
    mockConfigManager.setBest.mockReturnValue();

    // Mock runTool to return success
    mockRunTool.mockResolvedValue({
      success: true,
      timeTaken: 0.1,
      output: 'Test output'
    });
  });

  it('should handle direct prompt correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await defaultCommand('regular prompt text');

    // Verify that runTool was called with the original prompt
    expect(mockRunTool).toHaveBeenCalledWith('test-tool', 'regular prompt text', false, true);

    consoleSpy.mockRestore();
  });

  it('should handle multi-line prompt correctly', async () => {
    const multiLinePrompt = `Hello!

1. Tell me a joke about programming

2. Tell me how old is php programming language

3. write a hello world program in javascript`;

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await defaultCommand(multiLinePrompt);

    // Verify that runTool was called with the multi-line prompt
    expect(mockRunTool).toHaveBeenCalledWith('test-tool', multiLinePrompt, false, true);

    consoleSpy.mockRestore();
  });
});