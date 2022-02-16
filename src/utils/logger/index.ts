import { magenta, cyan, blue, yellow, red, gray, green, bold } from 'colorette';
import logLevel from 'loglevel';
import prefix from 'loglevel-plugin-prefix';
import { json } from 'stream/consumers';

export const setupLogger = (): void => {
  const colors = {
    TRACE: magenta,
    DEBUG: cyan,
    INFO: blue,
    WARN: yellow,
    ERROR: red,
  };
  const ENV = process?.env?.NODE_ENV;
  if (['development' || 'test'].includes(ENV)) logLevel.setLevel('trace');
  else logLevel.setLevel('info');

  prefix.reg(logLevel);

  prefix.apply(logLevel, {
    format(level, name, timestamp) {
      return `${gray(`[${timestamp}]`)} ${colors[level.toUpperCase() as keyof typeof colors](level)} ${green(
        `${name}:`
      )}`;
    },
  });

  prefix.apply(logLevel.getLogger('critical'), {
    format(level, name, timestamp) {
      return bold(red(`[${timestamp}] ${level} ${name}:`));
    },
  });
};

function getCustomLogger() {
  setupLogger();
  const parseArgs = (args: any[]) => args.map(arg=>JSON.stringify(arg)).join(' :: ');
  return {
    trace: (...args: any[]) => logLevel.trace(parseArgs(args)),
    debug: (...args: any[]) => logLevel.debug(parseArgs(args)),
    info: (...args: any[]) => logLevel.info(parseArgs(args)),
    warn: (...args: any[]) => logLevel.warn(parseArgs(args)),
    error: (...args: any[]) => logLevel.error(parseArgs(args)),
  };
}

export const log = getCustomLogger();
