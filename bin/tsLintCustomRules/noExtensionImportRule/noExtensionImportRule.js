"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const VALIDATION_PATTERN = /\.ts\';$/i;
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, super.getOptions()));
    }
}
Rule.FAILURE_STRING = '.ts extension on import statement forbidden';
Rule.metadata = {
    ruleName: 'no-extension-import',
    type: 'maintainability',
    description: 'Imported files should not have extensions.',
    options: null,
    optionsDescription: '',
    typescriptOnly: true
};
exports.Rule = Rule;
// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    endsWithExtension(node) {
        return VALIDATION_PATTERN.test(node.getFullText());
    }
    visitImportDeclaration(node) {
        if (this.endsWithExtension(node)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}
//# sourceMappingURL=noExtensionImportRule.js.map