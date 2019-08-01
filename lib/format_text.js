"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = formatText;var _sprintfJs = require("sprintf-js");

// Regexes taken from or inspired by sprintf-js
const Regex = {
  TEMPLATE_LITERAL: /\${([^)]+?)}/g,
  KEY: /^([a-z_][a-z_\d]*)/i,
  KEY_ACCESS: /^\.([a-z_][a-z_\d]*)/i,
  INDEX_ACCESS: /^\[(\d+)\]/ };


/**
                                 * imported from https://github.com/bigchaindb/js-utility-belt/
                                 * @private
                                 * Formats strings similarly to C's sprintf, with the addition of '${...}' formats.
                                 *
                                 * Makes a first pass replacing '${...}' formats before passing the expanded string and other
                                 * arguments to sprintf-js. For more information on what sprintf can do, see
                                 * https://github.com/alexei/sprintf.js.
                                 *
                                 * Examples:
                                 *   formatText('Hi there ${dimi}!', { dimi: 'Dimi' })
                                 *       => 'Hi there Dimi!'
                                 *
                                 *   formatText('${database} is %(status)s', { database: 'BigchainDB', status: 'big' })
                                 *       => 'BigchainDB is big'
                                 *
                                 * Like sprintf-js, string interpolation for keywords and indexes is supported too:
                                 *   formatText('Berlin is best known for its ${berlin.topKnownFor[0].name}', {
                                 *       berlin: {
                                 *           topKnownFor: [{
                                 *               name: 'Currywurst'
                                 *           }, ...
                                 *           ]
                                 *       }
                                 *   })
                                 *       => 'Berlin is best known for its Currywurst'
                                 */
function formatText(s, ...argv) {
  let expandedFormatStr = s;

  // Try to replace formats of the form '${...}' if named replacement fields are used
  if (s && argv.length === 1 && typeof argv[0] === "object") {
    const templateSpecObj = argv[0];

    expandedFormatStr = s.replace(
    Regex.TEMPLATE_LITERAL,
    (match, replacement) => {
      let interpolationLeft = replacement;

      /**
                                            * @private
                                            * Interpolation algorithm inspired by sprintf-js.
                                            *
                                            * Goes through the replacement string getting the left-most key or index to interpolate
                                            * on each pass. `value` at each step holds the last interpolation result, `curMatch` is
                                            * the current property match, and `interpolationLeft` is the portion of the replacement
                                            * string still to be interpolated.
                                            *
                                            * It's useful to note that RegExp.exec() returns with an array holding:
                                            *   [0]:  Full string matched
                                            *   [1+]: Matching groups
                                            *
                                            * And that in the regexes defined, the first matching group always corresponds to the
                                            * property matched.
                                            */
      let value;
      let curMatch = Regex.KEY.exec(interpolationLeft);
      if (curMatch !== null) {
        value = templateSpecObj[curMatch[1]];

        // Assigning in the conditionals here makes the code less bloated
        /* eslint-disable no-cond-assign */
        while (
        (interpolationLeft = interpolationLeft.substring(
        curMatch[0].length)) &&

        value != null)
        {
          if (
          curMatch = Regex.KEY_ACCESS.exec(
          interpolationLeft))

          {
            value = value[curMatch[1]];
          } else if (
          curMatch = Regex.INDEX_ACCESS.exec(
          interpolationLeft))

          {
            value = value[curMatch[1]];
          } else {
            break;
          }
        }
        /* eslint-enable no-cond-assign */
      }

      // If there's anything left to interpolate by the end then we've failed to interpolate
      // the entire replacement string.
      if (interpolationLeft.length) {
        throw new SyntaxError(
        `[formatText] failed to parse named argument key: ${replacement}`);

      }

      return value;
    });

  }

  return (0, _sprintfJs.sprintf)(expandedFormatStr, ...argv);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mb3JtYXRfdGV4dC5qcyJdLCJuYW1lcyI6WyJSZWdleCIsIlRFTVBMQVRFX0xJVEVSQUwiLCJLRVkiLCJLRVlfQUNDRVNTIiwiSU5ERVhfQUNDRVNTIiwiZm9ybWF0VGV4dCIsInMiLCJhcmd2IiwiZXhwYW5kZWRGb3JtYXRTdHIiLCJsZW5ndGgiLCJ0ZW1wbGF0ZVNwZWNPYmoiLCJyZXBsYWNlIiwibWF0Y2giLCJyZXBsYWNlbWVudCIsImludGVycG9sYXRpb25MZWZ0IiwidmFsdWUiLCJjdXJNYXRjaCIsImV4ZWMiLCJzdWJzdHJpbmciLCJTeW50YXhFcnJvciJdLCJtYXBwaW5ncyI6IndHQUFBOztBQUVBO0FBQ0EsTUFBTUEsS0FBSyxHQUFHO0FBQ1ZDLEVBQUFBLGdCQUFnQixFQUFFLGVBRFI7QUFFVkMsRUFBQUEsR0FBRyxFQUFFLHFCQUZLO0FBR1ZDLEVBQUFBLFVBQVUsRUFBRSx1QkFIRjtBQUlWQyxFQUFBQSxZQUFZLEVBQUUsWUFKSixFQUFkOzs7QUFPQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJlLFNBQVNDLFVBQVQsQ0FBb0JDLENBQXBCLEVBQXVCLEdBQUdDLElBQTFCLEVBQWdDO0FBQzNDLE1BQUlDLGlCQUFpQixHQUFHRixDQUF4Qjs7QUFFQTtBQUNBLE1BQUlBLENBQUMsSUFBSUMsSUFBSSxDQUFDRSxNQUFMLEtBQWdCLENBQXJCLElBQTBCLE9BQU9GLElBQUksQ0FBQyxDQUFELENBQVgsS0FBbUIsUUFBakQsRUFBMkQ7QUFDdkQsVUFBTUcsZUFBZSxHQUFHSCxJQUFJLENBQUMsQ0FBRCxDQUE1Qjs7QUFFQUMsSUFBQUEsaUJBQWlCLEdBQUdGLENBQUMsQ0FBQ0ssT0FBRjtBQUNoQlgsSUFBQUEsS0FBSyxDQUFDQyxnQkFEVTtBQUVoQixLQUFDVyxLQUFELEVBQVFDLFdBQVIsS0FBd0I7QUFDcEIsVUFBSUMsaUJBQWlCLEdBQUdELFdBQXhCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLFVBQUlFLEtBQUo7QUFDQSxVQUFJQyxRQUFRLEdBQUdoQixLQUFLLENBQUNFLEdBQU4sQ0FBVWUsSUFBVixDQUFlSCxpQkFBZixDQUFmO0FBQ0EsVUFBSUUsUUFBUSxLQUFLLElBQWpCLEVBQXVCO0FBQ25CRCxRQUFBQSxLQUFLLEdBQUdMLGVBQWUsQ0FBQ00sUUFBUSxDQUFDLENBQUQsQ0FBVCxDQUF2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDSSxTQUFDRixpQkFBaUIsR0FBR0EsaUJBQWlCLENBQUNJLFNBQWxCO0FBQ2pCRixRQUFBQSxRQUFRLENBQUMsQ0FBRCxDQUFSLENBQVlQLE1BREssQ0FBckI7O0FBR0FNLFFBQUFBLEtBQUssSUFBSSxJQUpiO0FBS0U7QUFDRTtBQUNLQyxVQUFBQSxRQUFRLEdBQUdoQixLQUFLLENBQUNHLFVBQU4sQ0FBaUJjLElBQWpCO0FBQ1JILFVBQUFBLGlCQURRLENBRGhCOztBQUlFO0FBQ0VDLFlBQUFBLEtBQUssR0FBR0EsS0FBSyxDQUFDQyxRQUFRLENBQUMsQ0FBRCxDQUFULENBQWI7QUFDSCxXQU5ELE1BTU87QUFDRkEsVUFBQUEsUUFBUSxHQUFHaEIsS0FBSyxDQUFDSSxZQUFOLENBQW1CYSxJQUFuQjtBQUNSSCxVQUFBQSxpQkFEUSxDQURUOztBQUlMO0FBQ0VDLFlBQUFBLEtBQUssR0FBR0EsS0FBSyxDQUFDQyxRQUFRLENBQUMsQ0FBRCxDQUFULENBQWI7QUFDSCxXQU5NLE1BTUE7QUFDSDtBQUNIO0FBQ0o7QUFDRDtBQUNIOztBQUVEO0FBQ0E7QUFDQSxVQUFJRixpQkFBaUIsQ0FBQ0wsTUFBdEIsRUFBOEI7QUFDMUIsY0FBTSxJQUFJVSxXQUFKO0FBQ0QsNERBQW1ETixXQUFZLEVBRDlELENBQU47O0FBR0g7O0FBRUQsYUFBT0UsS0FBUDtBQUNILEtBOURlLENBQXBCOztBQWdFSDs7QUFFRCxTQUFPLHdCQUFRUCxpQkFBUixFQUEyQixHQUFHRCxJQUE5QixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcHJpbnRmIH0gZnJvbSBcInNwcmludGYtanNcIjtcblxuLy8gUmVnZXhlcyB0YWtlbiBmcm9tIG9yIGluc3BpcmVkIGJ5IHNwcmludGYtanNcbmNvbnN0IFJlZ2V4ID0ge1xuICAgIFRFTVBMQVRFX0xJVEVSQUw6IC9cXCR7KFteKV0rPyl9L2csXG4gICAgS0VZOiAvXihbYS16X11bYS16X1xcZF0qKS9pLFxuICAgIEtFWV9BQ0NFU1M6IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgSU5ERVhfQUNDRVNTOiAvXlxcWyhcXGQrKVxcXS9cbn07XG5cbi8qKlxuICogaW1wb3J0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYmlnY2hhaW5kYi9qcy11dGlsaXR5LWJlbHQvXG4gKiBAcHJpdmF0ZVxuICogRm9ybWF0cyBzdHJpbmdzIHNpbWlsYXJseSB0byBDJ3Mgc3ByaW50Ziwgd2l0aCB0aGUgYWRkaXRpb24gb2YgJyR7Li4ufScgZm9ybWF0cy5cbiAqXG4gKiBNYWtlcyBhIGZpcnN0IHBhc3MgcmVwbGFjaW5nICckey4uLn0nIGZvcm1hdHMgYmVmb3JlIHBhc3NpbmcgdGhlIGV4cGFuZGVkIHN0cmluZyBhbmQgb3RoZXJcbiAqIGFyZ3VtZW50cyB0byBzcHJpbnRmLWpzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiB3aGF0IHNwcmludGYgY2FuIGRvLCBzZWVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGV4ZWkvc3ByaW50Zi5qcy5cbiAqXG4gKiBFeGFtcGxlczpcbiAqICAgZm9ybWF0VGV4dCgnSGkgdGhlcmUgJHtkaW1pfSEnLCB7IGRpbWk6ICdEaW1pJyB9KVxuICogICAgICAgPT4gJ0hpIHRoZXJlIERpbWkhJ1xuICpcbiAqICAgZm9ybWF0VGV4dCgnJHtkYXRhYmFzZX0gaXMgJShzdGF0dXMpcycsIHsgZGF0YWJhc2U6ICdCaWdjaGFpbkRCJywgc3RhdHVzOiAnYmlnJyB9KVxuICogICAgICAgPT4gJ0JpZ2NoYWluREIgaXMgYmlnJ1xuICpcbiAqIExpa2Ugc3ByaW50Zi1qcywgc3RyaW5nIGludGVycG9sYXRpb24gZm9yIGtleXdvcmRzIGFuZCBpbmRleGVzIGlzIHN1cHBvcnRlZCB0b286XG4gKiAgIGZvcm1hdFRleHQoJ0JlcmxpbiBpcyBiZXN0IGtub3duIGZvciBpdHMgJHtiZXJsaW4udG9wS25vd25Gb3JbMF0ubmFtZX0nLCB7XG4gKiAgICAgICBiZXJsaW46IHtcbiAqICAgICAgICAgICB0b3BLbm93bkZvcjogW3tcbiAqICAgICAgICAgICAgICAgbmFtZTogJ0N1cnJ5d3Vyc3QnXG4gKiAgICAgICAgICAgfSwgLi4uXG4gKiAgICAgICAgICAgXVxuICogICAgICAgfVxuICogICB9KVxuICogICAgICAgPT4gJ0JlcmxpbiBpcyBiZXN0IGtub3duIGZvciBpdHMgQ3Vycnl3dXJzdCdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZm9ybWF0VGV4dChzLCAuLi5hcmd2KSB7XG4gICAgbGV0IGV4cGFuZGVkRm9ybWF0U3RyID0gcztcblxuICAgIC8vIFRyeSB0byByZXBsYWNlIGZvcm1hdHMgb2YgdGhlIGZvcm0gJyR7Li4ufScgaWYgbmFtZWQgcmVwbGFjZW1lbnQgZmllbGRzIGFyZSB1c2VkXG4gICAgaWYgKHMgJiYgYXJndi5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3ZbMF0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3QgdGVtcGxhdGVTcGVjT2JqID0gYXJndlswXTtcblxuICAgICAgICBleHBhbmRlZEZvcm1hdFN0ciA9IHMucmVwbGFjZShcbiAgICAgICAgICAgIFJlZ2V4LlRFTVBMQVRFX0xJVEVSQUwsXG4gICAgICAgICAgICAobWF0Y2gsIHJlcGxhY2VtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGludGVycG9sYXRpb25MZWZ0ID0gcmVwbGFjZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgICAgICAgICAqIEludGVycG9sYXRpb24gYWxnb3JpdGhtIGluc3BpcmVkIGJ5IHNwcmludGYtanMuXG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiBHb2VzIHRocm91Z2ggdGhlIHJlcGxhY2VtZW50IHN0cmluZyBnZXR0aW5nIHRoZSBsZWZ0LW1vc3Qga2V5IG9yIGluZGV4IHRvIGludGVycG9sYXRlXG4gICAgICAgICAgICAgICAgICogb24gZWFjaCBwYXNzLiBgdmFsdWVgIGF0IGVhY2ggc3RlcCBob2xkcyB0aGUgbGFzdCBpbnRlcnBvbGF0aW9uIHJlc3VsdCwgYGN1ck1hdGNoYCBpc1xuICAgICAgICAgICAgICAgICAqIHRoZSBjdXJyZW50IHByb3BlcnR5IG1hdGNoLCBhbmQgYGludGVycG9sYXRpb25MZWZ0YCBpcyB0aGUgcG9ydGlvbiBvZiB0aGUgcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgICAgKiBzdHJpbmcgc3RpbGwgdG8gYmUgaW50ZXJwb2xhdGVkLlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogSXQncyB1c2VmdWwgdG8gbm90ZSB0aGF0IFJlZ0V4cC5leGVjKCkgcmV0dXJucyB3aXRoIGFuIGFycmF5IGhvbGRpbmc6XG4gICAgICAgICAgICAgICAgICogICBbMF06ICBGdWxsIHN0cmluZyBtYXRjaGVkXG4gICAgICAgICAgICAgICAgICogICBbMStdOiBNYXRjaGluZyBncm91cHNcbiAgICAgICAgICAgICAgICAgKlxuICAgICAgICAgICAgICAgICAqIEFuZCB0aGF0IGluIHRoZSByZWdleGVzIGRlZmluZWQsIHRoZSBmaXJzdCBtYXRjaGluZyBncm91cCBhbHdheXMgY29ycmVzcG9uZHMgdG8gdGhlXG4gICAgICAgICAgICAgICAgICogcHJvcGVydHkgbWF0Y2hlZC5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgICAgICAgICAgbGV0IGN1ck1hdGNoID0gUmVnZXguS0VZLmV4ZWMoaW50ZXJwb2xhdGlvbkxlZnQpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJNYXRjaCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRlbXBsYXRlU3BlY09ialtjdXJNYXRjaFsxXV07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gQXNzaWduaW5nIGluIHRoZSBjb25kaXRpb25hbHMgaGVyZSBtYWtlcyB0aGUgY29kZSBsZXNzIGJsb2F0ZWRcbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uZC1hc3NpZ24gKi9cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGludGVycG9sYXRpb25MZWZ0ID0gaW50ZXJwb2xhdGlvbkxlZnQuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1ck1hdGNoWzBdLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlICE9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGN1ck1hdGNoID0gUmVnZXguS0VZX0FDQ0VTUy5leGVjKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnBvbGF0aW9uTGVmdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlW2N1ck1hdGNoWzFdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGN1ck1hdGNoID0gUmVnZXguSU5ERVhfQUNDRVNTLmV4ZWMoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVycG9sYXRpb25MZWZ0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbY3VyTWF0Y2hbMV1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbmQtYXNzaWduICovXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhbnl0aGluZyBsZWZ0IHRvIGludGVycG9sYXRlIGJ5IHRoZSBlbmQgdGhlbiB3ZSd2ZSBmYWlsZWQgdG8gaW50ZXJwb2xhdGVcbiAgICAgICAgICAgICAgICAvLyB0aGUgZW50aXJlIHJlcGxhY2VtZW50IHN0cmluZy5cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJwb2xhdGlvbkxlZnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBbZm9ybWF0VGV4dF0gZmFpbGVkIHRvIHBhcnNlIG5hbWVkIGFyZ3VtZW50IGtleTogJHtyZXBsYWNlbWVudH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBzcHJpbnRmKGV4cGFuZGVkRm9ybWF0U3RyLCAuLi5hcmd2KTtcbn1cbiJdfQ==