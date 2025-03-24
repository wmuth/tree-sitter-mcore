# tree-sitter-mcore
[Miking MCore](https://miking.org/docs/tutorials/getting-started#mcore) grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

The grammar is based on the grammar for the [Miking boot interpreter](https://github.com/miking-lang/miking/tree/develop/src/boot) written using Ocamllex and Menhir.

## Install
If you want to generate source files from the grammar use the tree-sitter cli to run `tree-sitter generate`. Otherwise use those which already exist in the repo.

Run `tree-sitter build` which will output a `mcore.so` which you can use like any other tree-sitter parser.

Integrations into editors vary but here is an example config for using the parser in NeoVim using [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter):

```lua
  { -- Highlight, edit, and navigate code
    'nvim-treesitter/nvim-treesitter',
    build = ':TSUpdate',
    opts = {
      ensure_installed = {},
      auto_install = true,
      highlight = {
        enable = true,
      },
      indent = { enable = true },
    },
    config = function(_, opts)
      -- [[ Configure Treesitter ]]
      local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
      parser_config.mcore = {
        install_info = {
          url = 'https://github.com/wmuth/tree-sitter-mcore',
          branch = 'main',
          files = { 'src/parser.c', 'src/scanner.c' },
          requires_generate_from_grammar = false,
        },
        filetype = 'mcore',
      }

      vim.filetype.add {
        extension = {
          mc = 'mcore',
        },
      }

      require('nvim-treesitter.configs').setup(opts)
    end,
  },
```

# Todo
- Improved tests, currently can parse all .mc files in the stdlib of miking without errors ( `tree-sitter parse /path/to/miking/src/stdlib/**/*.mc | rg 'ERROR'` )
- Improved documentation
- Improved highlighting
