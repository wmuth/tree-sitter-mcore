[ (sect_comment) (line_comment) ] @comment
(char) @character
(string) @string
(float) @number.float
(int) @number
(bool) @boolean

[ (frozen_ident) (var_ident) ] @variable

[ "(" ")" "[" "]" "{" "}" ] @punctuation.bracket
[ "," "::" ";" "|" ] @punctuation.delimiter
[ "+=" "*=" "=" "+" "-" "++" "&" "!" "->" "<-" ">" "<" "." ] @operator
[ "_" (empty_parens) (empty_squares) (empty_brackets) ] @variable.builtin

[
  "if"
  "then"
  "else"
  "true"
  "false"
  "match"
  "with"
  "utest"
  "type"
  "con"
  "lang"
  "let"
  "recursive"
  "lam"
  "in"
  "end"
  "syn"
  "cosyn"
  "sem"
  "cosem"
  "nothing"
  "use"
  "include"
  "never"
  "using"
  "external"
  "switch"
  "case"
  "all"
  "dive"
  "prerun"
  "extend"
  "rectype"
  "recfield"
  "of"
  "atleast"
  "atmost"
  "extend"
  "nothing"
  "rectype"
  "recfield"
  "of"
  "atleast"
  "atmost"
  (mexpr_tok)
] @keyword

[
  "Unknown"
  "Bool"
  "Int"
  "Float"
  "Char"
  "String"
  (tensor_tok)
  (type_ident)
] @type.builtin

(con_ident) @constructor
(label_ident) @variable.member
(let (var_ident) @function)
(topLet (var_ident) @function)
(mexpr "lam" (var_ident) @variable.parameter)
