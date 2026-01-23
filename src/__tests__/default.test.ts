import { defaultCommand } from '../commands/default';
import { configManager } from '../config';
import { runTool } from '../commands/run';

// Mock dependencies
jest.mock('../config');
jest.mock('../commands/run');
jest.mock('ora', () => jest.fn(() => ({
    start: jest.fn(() => ({
        succeed: jest.fn(),
        fail: jest.fn()
    }))
})));
jest.mock('chalk', () => {
    const mockFn = jest.fn((str) => str);
    Object.assign(mockFn, {
        bold: mockFn,
        cyan: mockFn,
        dim: mockFn,
        italic: mockFn,
        bgGray: mockFn,
        gray: mockFn,
        white: mockFn,
        blue: mockFn,
        green: mockFn,
        red: mockFn,
        yellow: mockFn,
        magenta: mockFn
    });
    return mockFn;
});

const mockConfigManager = configManager as jest.Mocked<typeof configManager>;
const mockRunTool = runTool as jest.MockedFunction<typeof runTool>;
mockConfigManager.getTools.mockReturnValue([]);
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit called'); });
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('Default Command', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should run benchmark if no best tool configured', async () => {
        mockConfigManager.getBest.mockReturnValue(null);

        await expect(defaultCommand('test prompt')).rejects.toThrow('process.exit called');
        expect(mockConsoleLog).toHaveBeenCalledWith('No best tool configured. Running benchmark...');
        expect(mockConsoleLog).toHaveBeenCalledWith('No tools configured. Use "ai add" to add a tool.');
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should succeed with best tool', async () => {
        mockConfigManager.getBest.mockReturnValue('best-tool');
        mockRunTool.mockResolvedValue({ success: true, timeTaken: 1.0, output: 'Hello response' });

        await defaultCommand('test prompt');
        expect(mockRunTool).toHaveBeenCalledWith('best-tool', 'test prompt', false, true);
        expect(mockConsoleLog).toHaveBeenCalledWith('Hello response');
        expect(mockExit).not.toHaveBeenCalled();
    });

    it('should fail with best tool and autocheck disabled', async () => {
        mockConfigManager.getBest.mockReturnValue('best-tool');
        mockRunTool.mockResolvedValue({ success: false, error: 'failed', timeTaken: 1.0 });

        await expect(defaultCommand('test prompt', { autocheck: false })).rejects.toThrow('process.exit called');
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should try other tools and succeed with first alternative', async () => {
        mockConfigManager.getBest.mockReturnValue('best-tool');
        mockRunTool
            .mockResolvedValueOnce({ success: false, timeTaken: 1.0 }) // best tool fails
            .mockResolvedValueOnce({ success: true, timeTaken: 0.5, output: 'Fast response' }); // alternative succeeds

        mockConfigManager.getTools.mockReturnValue([
            { name: 'best-tool', command: 'cmd1', description: 'desc1', time_taken: 1.0, last_ran: null, okay: false },
            { name: 'fast-tool', command: 'cmd2', description: 'desc2', time_taken: 0.5, last_ran: null, okay: true },
            { name: 'slow-tool', command: 'cmd3', description: 'desc3', time_taken: 2.0, last_ran: null, okay: true },
        ]);

        await defaultCommand('test prompt');
        expect(mockRunTool).toHaveBeenCalledWith('best-tool', 'test prompt', false, true);
        expect(mockRunTool).toHaveBeenCalledWith('fast-tool', 'test prompt', false, true);
        expect(mockConsoleLog).toHaveBeenCalledWith('Fast response');
        expect(mockConfigManager.setBest).toHaveBeenCalledWith('fast-tool');
        expect(mockExit).not.toHaveBeenCalled();
    });

    it('should try all tools and fail if none succeed', async () => {
        mockConfigManager.getBest.mockReturnValue('best-tool');
        mockRunTool.mockResolvedValue({ success: false, timeTaken: 1.0 });

        mockConfigManager.getTools.mockReturnValue([
            { name: 'best-tool', command: 'cmd1', description: 'desc1', time_taken: 1.0, last_ran: null, okay: false },
            { name: 'tool2', command: 'cmd2', description: 'desc2', time_taken: 0.5, last_ran: null, okay: true },
        ]);

        await expect(defaultCommand('test prompt')).rejects.toThrow('process.exit called');
        expect(mockConsoleLog).toHaveBeenCalledWith('All tools failed to provide a response.');
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});