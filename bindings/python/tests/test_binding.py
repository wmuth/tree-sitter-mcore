from unittest import TestCase

import tree_sitter, tree_sitter_mcore


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_mcore.language())
        except Exception:
            self.fail("Error loading Mcore grammar")
