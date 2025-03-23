/**
 * @file Miking MCore grammar for tree-sitter.
 * @author wmuth
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "mcore",

  externals: ($) => [$.sect_comment, $.line_comment],
  extras: ($) => [$.sect_comment, $.line_comment, /\s/],

  rules: {
    main: ($) =>
      choice(
        seq(
          repeat($.include),
          repeat($.top),
          optional(seq($.mexpr_tok, $.mexpr)),
        ),
        $.mexpr,
      ),

    include: ($) => seq("include", $.string),

    top: ($) =>
      choice(
        $.mlang,
        $.topLet,
        $.topType,
        $.topRecLet,
        $.topCon,
        $.topUtest,
        $.topExt,
      ),

    topRecLet: ($) => seq("recursive", repeat1($.let), "end"),
    topCon: ($) => seq("con", $.con_ident, optional(seq(":", $.ty))),

    topLet: ($) =>
      seq("let", $.var_ident, optional(seq(":", $.ty)), "=", $.mexpr),

    topType: ($) =>
      seq("type", $.type_ident, repeat($.var_ident), optional(seq("=", $.ty))),

    topUtest: ($) =>
      choice(
        seq("utest", $.mexpr, "with", $.mexpr),
        seq("utest", $.mexpr, "with", $.mexpr, "using", $.mexpr),
        seq("utest", $.mexpr, "with", $.mexpr, "else", $.mexpr),
        seq(
          "utest",
          $.mexpr,
          "with",
          $.mexpr,
          "using",
          $.mexpr,
          "else",
          $.mexpr,
        ),
      ),
    topExt: ($) =>
      choice(
        seq("external", $.ident, ":", $.ty),
        seq("external", $.ident, "!", ":", $.ty),
      ),

    mlang: ($) =>
      seq(
        "lang",
        $.ident,
        optional(seq("=", $.lang_list, repeat($.with_list))),
        repeat($.decl),
        "end",
      ),

    lang_list: ($) => choice(seq($.ident, "+", $.lang_list), $.ident),

    with_list: ($) =>
      choice(
        seq("with", $.type_ident, "=", $.with_type_list),
        seq("with", $.var_ident, "=", $.with_var_list),
      ),

    with_type_list: ($) =>
      choice(
        seq($.with_type_list, "+", $.ident, ".", $.type_ident),
        seq($.ident, ".", $.type_ident),
      ),

    with_var_list: ($) =>
      choice(
        seq($.with_var_list, "+", $.ident, ".", $.var_ident),
        seq($.ident, ".", $.var_ident),
      ),

    decl: ($) =>
      choice(
        seq(
          "cosyn",
          $.type_ident,
          repeat($.var_ident),
          choice("=", "*="),
          $.ty,
        ),
        seq(
          "cosem",
          $.var_ident,
          optional($.params),
          "=",
          repeat($.cosem_case),
        ),
        seq(
          "cosem",
          $.var_ident,
          optional($.params),
          "*=",
          repeat($.cosem_case),
        ),
        seq("cosem", $.var_ident, ":", $.ty),
        seq("syn", $.type_ident, repeat($.var_ident), "=", repeat($.constr)),
        seq("syn", $.type_ident, repeat($.var_ident), "+=", repeat($.constr)),
        seq(
          "syn",
          $.type_ident,
          repeat($.var_ident),
          "*=",
          optional($.ty),
          repeat($.constr),
        ),
        seq("sem", $.var_ident, optional($.params), "=", repeat($.case)),
        seq("sem", $.var_ident, optional($.params), "+=", repeat($.case)),
        seq("sem", $.var_ident, ":", $.ty),
        seq("type", $.type_ident, repeat($.var_ident), "=", $.ty),
      ),

    case: ($) => seq("|", $.pat, "->", $.mexpr),
    constr: ($) => seq("|", $.con_ident, optional($.ty)),
    cosem_case: ($) => seq("|", $.copat, "<-", $.mexpr),
    params: ($) =>
      choice(
        seq("(", $.var_ident, ":", $.ty, ")", optional($.params)),
        seq($.var_ident, optional($.params)),
      ),

    mexpr: ($) =>
      choice(
        $.sequence,
        seq("type", $.type_ident, repeat($.var_ident), "in", $.mexpr),
        seq(
          "type",
          $.type_ident,
          repeat($.var_ident),
          "=",
          $.ty,
          "in",
          $.mexpr,
        ),
        seq("recursive", repeat1($.let), "in", $.mexpr),
        seq(
          "let",
          $.var_ident,
          optional(seq(":", $.ty)),
          "=",
          $.mexpr,
          "in",
          $.mexpr,
        ),
        seq("lam", $.var_ident, optional(seq(":", $.ty)), ".", $.mexpr),
        seq("lam", ".", $.mexpr),
        seq("if", $.mexpr, "then", $.mexpr, "else", $.mexpr),
        seq("con", $.con_ident, optional(seq(":", $.ty)), "in", $.mexpr),
        seq("match", $.mexpr, "with", $.pat, "then", $.mexpr, "else", $.mexpr),
        seq("match", $.mexpr, "with", $.pat, "in", $.mexpr),
        seq("switch", $.mexpr, $.swcases),
        seq("dive", $.mexpr),
        seq("prerun", $.mexpr),
        seq("use", $.ident, "in", $.mexpr),
        seq("utest", $.mexpr, "with", $.mexpr, "in", $.mexpr),
        seq("utest", $.mexpr, "with", $.mexpr, "using", $.mexpr, "in", $.mexpr),
        seq(
          "utest",
          $.mexpr,
          "with",
          $.mexpr,
          "using",
          $.mexpr,
          "else",
          $.mexpr,
          "in",
          $.mexpr,
        ),
        seq("external", $.ident, ":", $.ty, "in", $.mexpr),
        seq("external", $.ident, "!", ":", $.ty, "in", $.mexpr),
        seq("rectype", $.type_ident, repeat($.var_ident), "in", $.mexpr),
        seq("recfield", $.var_ident, optional(seq(":", $.ty)), "in", $.mexpr),
      ),

    let: ($) => seq("let", $.var_ident, optional(seq(":", $.ty)), "=", $.mexpr),
    sequence: ($) => choice($.left, seq($.left, ";", $.mexpr)),
    left: ($) =>
      prec.left(choice($.atom, seq($.left, $.atom), seq($.con_ident, $.atom))),

    swcases: ($) =>
      choice(seq("case", $.pat, "then", $.mexpr, $.swcases), "end"),

    atom: ($) =>
      choice(
        seq($.atom, ".", choice($.int, $.label_ident)),
        seq("(", $.seq, ")"),
        seq("(", $.mexpr, ",", ")"),
        $.empty_parens,
        $.var_ident,
        $.frozen_ident,
        $.char,
        $.int,
        $.float,
        $.bool,
        "never",
        $.string,
        seq("[", $.seq, "]"),
        $.empty_squares,
        seq("{", $.labels, "}"),
        $.empty_brackets,
        seq("{", $.mexpr, "with", $.labels, "}"),
        seq("{", $.con_ident, "of", $.labels, "}"),
        seq("{", $.con_ident, "of", "nothing", "}"),
        seq("{", "extend", $.mexpr, "with", $.labels, "}"),
      ),

    seq: ($) => choice($.mexpr, seq($.mexpr, ",", $.seq)),

    labels: ($) =>
      choice(
        seq($.label_ident, "=", $.mexpr),
        seq($.label_ident, "=", $.mexpr, ",", $.labels),
      ),

    pats: ($) => choice($.pat, seq($.pat, ",", $.pats)),
    patseq: ($) => choice($.empty_squares, seq("[", $.pats, "]"), $.string),

    pat_labels: ($) =>
      choice(
        seq($.label_ident, "=", $.pat),
        seq($.label_ident, "=", $.pat, ",", $.pat_labels),
      ),

    name: ($) => choice($.var_ident, "_"),
    copat: ($) => seq("{", $.var_ident, repeat(seq(",", $.var_ident)), "}"),
    pat: ($) => choice(seq($.pat_conj, "|", $.pat), $.pat_conj),
    pat_conj: ($) => choice(seq($.pat_atom, "&", $.pat_conj), $.pat_atom),

    pat_atom: ($) =>
      choice(
        $.name,
        seq("!", $.pat_atom),
        seq($.con_ident, $.pat_atom),
        $.patseq,
        seq($.patseq, "++", $.name, "++", $.patseq),
        seq($.patseq, "++", $.name),
        seq($.name, "++", $.patseq),
        seq("(", $.pat, ")"),
        seq("(", $.pat, ",)"),
        seq("(", $.pat, ",", seq($.pat, repeat(seq(",", $.pat))), ")"),
        $.empty_brackets,
        seq("{", $.pat_labels, "}"),
        $.int,
        $.char,
        $.bool,
        $.empty_parens,
      ),

    ty: ($) =>
      choice(
        $.ty_left,
        seq($.ty_left, "->", $.ty),
        seq("all", $.var_ident, ".", $.ty),
        seq(
          "all",
          $.var_ident,
          "::",
          "{",
          optional(seq($.type_with_cons, repeat(seq(",", $.type_with_cons)))),
          "}.",
          $.ty,
        ),
        seq("use", $.ident, "in", $.ty),
      ),

    ty_left: ($) =>
      prec.right(choice($.ty_ish_atom, seq($.ty_left, $.ty_ish_atom))),
    ty_ish_atom: ($) => choice($.ty_atom, $.ty_data),

    ty_atom: ($) =>
      choice(
        $.empty_parens,
        seq("(", $.ty, ")"),
        seq("[", $.ty, "]"),
        seq("(", $.ty, ",", $.ty, repeat(seq(",", $.ty)), ")"),
        $.empty_brackets,
        seq("{", $.label_tys, "}"),
        seq($.tensor_tok, "[", $.ty, "]"),
        "Unknown",
        "Bool",
        "Int",
        "Float",
        "Char",
        "String",
        $.type_ident,
        $.var_ident,
        "_",
        seq($.atlatm, $.ident, "::", $.ident),
        seq(
          $.atlatm,
          "(",
          $.ident,
          "::",
          $.ident,
          optional($.plusl),
          optional($.minusl),
          ")",
        ),
      ),

    atlatm: ($) => choice("atleast", "atmost"),
    plusl: ($) => seq("+", repeat(seq(",", $.ident, "::", $.ident))),
    minusl: ($) => seq("-", repeat(seq(",", $.ident, "::", $.ident))),

    ty_data: ($) =>
      choice(
        seq("{", $.var_ident, "}"),
        seq("{", $.con_ident, repeat($.con_list), "}"),
        seq("{", "!", repeat($.con_list), "}"),
      ),

    type_with_cons: ($) =>
      choice(
        seq($.type_ident, "[", ">", repeat($.con_list), "]"),
        seq($.type_ident, "[", "|", repeat($.con_list), "]"),
        seq($.type_ident, "[", "<", repeat($.con_list), "]"),
        seq(
          $.type_ident,
          "[",
          "<",
          repeat($.con_list),
          "|",
          repeat($.con_list),
          "]",
        ),
      ),

    con_list: ($) => choice($.var_ident, $.con_ident),
    label_tys: ($) => seq($.label_ty, repeat(seq(",", $.label_ty))),
    label_ty: ($) => seq($.label_ident, ":", $.ty),

    lident: ($) => /[a-z_]\w*/,
    uident: ($) => /[A-Z]\w*/,
    ident: ($) => choice($.lident, $.uident),
    con_ident: ($) => choice($.uident, seq("#con", $.string)),
    frozen_ident: ($) => seq("#frozen", $.string),
    label_ident: ($) => choice($.ident, seq("#label", $.string)),
    type_ident: ($) => choice($.uident, seq("#type", $.string)),
    var_ident: ($) => choice($.lident, seq("#var", $.string)),
    bool: ($) => choice("true", "false"),
    char: ($) => choice($.normal_char, $.newline_char, $.tick_char),
    normal_char: ($) =>
      token(seq("'", choice(/\\['"?\\abfnrtv]/, /[^\\'\n]/), "'")),
    newline_char: ($) => token("'\n'"),
    tick_char: ($) => token("'''"),
    string: ($) =>
      token(seq('"', repeat(choice(/\\['"?\\abfnrtv]/, /[^\\"]+/)), '"')),
    float: ($) => /-?\d+(\.\d*)?([eE][+-]?\d+)?/,
    int: ($) => /-?\d+/,
    mexpr_tok: ($) => "mexpr",
    tensor_tok: ($) => "Tensor",
    empty_parens: ($) => seq("(", ")"),
    empty_squares: ($) => seq("[", "]"),
    empty_brackets: ($) => seq("{", "}"),
  },
});
