S-expression calculator
=======================
Made by [Chamod Gamage](https://www.chamod.ga)

A command line program that acts as a simple calculator: it takes a
single argument as an expression and prints out the integer result of
evaluating it.

This program has been implemented in Node.js - here are its invocations (navigate to root directory first):

    $ node ./calculator.js 123
    123

    $ node ./calculator.js "(add 12 12)"
    24

Expression syntax
-----------------

Since the expression is passed in as a command line argument, it is a string.
The syntax resembles [S-expressions][sexp] but the rules are simplified. An
expression can be in one of two forms:

### Integers

An integer is just a sequence of base 10 digits. For example:

    123

### Function calls

A function call takes the following form:

    (FUNCTION EXPR EXPR EXPR ...)

A function call is always delimited by parenthesis `(` and `)`.

The `FUNCTION` is one of `add` or `multiply`.

The `EXPR` can be any arbitrary expression, i.e. it can be further function
calls or integer expressions.

Exactly one space is used to separate each term.

For example:

    (add 123 456 789)

    (multiply (add 1 2) 3 4)

Expression grammar
------------------

A formal grammar specified in [EBNF][ebnf]:

    DIGIT = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

    EXPR = INTEGER | ADD | MULTIPLY;

    INTEGER = DIGIT, { DIGIT };

    ADD = "(", "a", "d", "d", " ", EXPR, " ", EXPR, ")";

    MULTIPLY = "(", "m", "u", "l", "t", "i", "p", "l", "y", " ", EXPR, " ", EXPR, ")";

Expression semantics
--------------------

This calculator supports the `add` and`multiply` functions, taking an expression string as a command
line argument and printing out the result of evaluating the expression.

The examples follow the convention:

    INPUT
    OUTPUT

Where `INPUT` is the expression string passed as a single argument and `OUTPUT`
is the output printed to stdout by your program.

### Integers

Integers are evaluated as the number they represent:

    123
    123

    0
    0

### Add

The `add` function:

1. accepts exactly 2 sub-expressions
2. fully evaluates the 2 sub-expressions
3. returns the result of adding the 2 sub-expressions together

```
(add 1 1)
2

(add 0 (add 3 4))
7

(add 3 (add (add 3 3) 3))
12
```

### Multiply

The `multiply` function:

1. accepts exactly 2 sub-expressions
2. fully evaluates the 2 sub-expressions
3. returns the result of multiplying the 2 sub-expressions together

```
(multiply 1 1)
1

(multiply 0 (multiply 3 4))
0

(multiply 2 (multiply 3 4))
24

(multiply 3 (multiply (multiply 3 3) 3))
81
```

Examples
--------

It's possible to mix and match integers and function calls to build arbitrary calculations:

    (add 1 (multiply 2 3))
    7

    (multiply 2 (add (multiply 2 3) 8))
    28

  
Evaluation Criteria
-------------------

This is not a complete rubric by which we evaluate your submission, but gives
you a baseline of things we look for.


[sexp]: https://en.wikipedia.org/wiki/S-expression
[ebnf]: https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form
