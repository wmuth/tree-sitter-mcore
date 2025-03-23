#include <tree_sitter/alloc.h>
#include <tree_sitter/parser.h>

enum TokenType {
  LINE_COMMENT,
  SECT_COMMENT,
};

typedef struct {
  char nesting_level;
} Scanner;

// LookAheadIs
static inline bool lai(TSLexer *lexer, char c) { return lexer->lookahead == c; }

static void skip_whitespace(TSLexer *lexer) {
  while (lai(lexer, ' ') || lai(lexer, '\t') || lai(lexer, '\r') ||
         lai(lexer, '\n')) {
    lexer->advance(lexer, true);
  }
}

static bool scan_sect_comment(TSLexer *lexer, Scanner *scanner) {
  if (!lai(lexer, '/'))
    return false;

  lexer->advance(lexer, false);
  if (!lai(lexer, '-'))
    return false;

  while (lai(lexer, '-'))
    lexer->advance(lexer, false);

  scanner->nesting_level = 1;

  while (scanner->nesting_level > 0 && !lexer->eof(lexer)) {
    char c = lexer->lookahead;
    lexer->advance(lexer, false);

    if (c == '/') {
      if (lai(lexer, '-')) {
        lexer->advance(lexer, false);

        while (lai(lexer, '-'))
          lexer->advance(lexer, false);

        scanner->nesting_level++;
      }
    } else if (c == '-') {
      while (lai(lexer, '-'))
        lexer->advance(lexer, false);

      if (lai(lexer, '/')) {
        lexer->advance(lexer, false);
        scanner->nesting_level--;
      }
    }
  }

  lexer->result_symbol = SECT_COMMENT;
  return true;
}

static bool scan_line_comment(TSLexer *lexer) {
  if (!lai(lexer, '-'))
    return false;

  lexer->advance(lexer, false);
  if (!lai(lexer, '-'))
    return false;

  lexer->advance(lexer, false);
  while (!lai(lexer, '\n') && !lexer->eof(lexer))
    lexer->advance(lexer, false);

  lexer->result_symbol = LINE_COMMENT;
  return true;
}

bool tree_sitter_mcore_external_scanner_scan(void *payload, TSLexer *lexer,
                                             const bool *valid_symbols) {
  Scanner *scanner = (Scanner *)payload;
  skip_whitespace(lexer);

  if (valid_symbols[SECT_COMMENT] && scan_sect_comment(lexer, scanner)) {
    return true;
  }

  if (valid_symbols[LINE_COMMENT] && scan_line_comment(lexer)) {
    return true;
  }

  return false;
}

void *tree_sitter_mcore_external_scanner_create() {
  Scanner *scanner = ts_calloc(1, sizeof(Scanner));
  scanner->nesting_level = 0;
  return scanner;
}

void tree_sitter_mcore_external_scanner_destroy(void *payload) {
  Scanner *scanner = (Scanner *)payload;
  ts_free(scanner);
}

unsigned tree_sitter_mcore_external_scanner_serialize(void *payload,
                                                      char *buffer) {
  Scanner *scanner = (Scanner *)payload;
  buffer[0] = scanner->nesting_level;
  return 1;
}

void tree_sitter_mcore_external_scanner_deserialize(void *payload,
                                                    const char *buffer,
                                                    unsigned length) {
  Scanner *scanner = (Scanner *)payload;
  if (length > 0) {
    scanner->nesting_level = buffer[0];
  }
}
