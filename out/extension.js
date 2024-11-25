"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
/**
 * Called when the extension is activated.
 *
 * Sets up a status bar item that updates its text whenever the user selects a new range of text in a text editor.
 * The status bar item displays the average mass of the selected peptide sequences. If the user selects a sequence that is not a valid peptide sequence, the status bar item displays 'ProMass'.
 *
 * The update interval and whether to calculate the mass for amidated C-terminus can be customized in the VS Code settings.
 */
function activate(context) {
    console.log('Protein Mass Calculator extension activated successfully.');
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 999);
    statusBarItem.text = 'ProMass';
    statusBarItem.tooltip = 'Displays the average mass of selected peptide sequences.';
    statusBarItem.show();
    let updateTimer;
    let updateInterval = vscode.workspace.getConfiguration('proteinMassCalculator').get('updateInterval', 1000);
    let amidatedCterminus = vscode.workspace.getConfiguration('proteinMassCalculator').get('amidatedCterminus', false);
    vscode.window.onDidChangeTextEditorSelection(event => {
        if (updateTimer) {
            clearTimeout(updateTimer);
        }
        updateTimer = setTimeout(() => {
            try {
                const editor = event.textEditor;
                if (!editor) {
                    statusBarItem.text = 'ProMass';
                    return;
                }
                const selection = editor.selection;
                if (selection.isEmpty) {
                    statusBarItem.text = 'ProMass';
                    return;
                }
                const selectedText = editor.document.getText(selection).toUpperCase().trim();
                if (!selectedText) {
                    statusBarItem.text = 'ProMass';
                    return;
                }
                const peptidePattern = /^[ACDEFGHIKLMNPQRSTVWY]+$/;
                if (peptidePattern.test(selectedText)) {
                    const mass = calculatePeptideMass(selectedText, amidatedCterminus);
                    statusBarItem.text = `${amidatedCterminus ? 'C-Amide ' : ''}${mass.toFixed(2)} Da`;
                }
                else {
                    statusBarItem.text = 'ProMass';
                }
            }
            catch (error) {
                console.error('An error occurred:', error);
                statusBarItem.text = 'Error';
            }
        }, updateInterval);
    });
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('proteinMassCalculator.updateInterval')) {
            updateInterval = vscode.workspace.getConfiguration('proteinMassCalculator').get('updateInterval', 1000);
            console.log(`Updated updateInterval: ${updateInterval} ms`);
        }
        if (event.affectsConfiguration('proteinMassCalculator.amidatedCterminus')) {
            amidatedCterminus = vscode.workspace.getConfiguration('proteinMassCalculator').get('amidatedCterminus', false);
            console.log(`Updated amidatedCterminus: ${amidatedCterminus}`);
        }
    });
    context.subscriptions.push(statusBarItem);
}
/**
 * Called when the extension is deactivated.
 */
function deactivate() {
    console.log('Protein Mass Calculator extension deactivated.');
}
const aminoAcidMasses = {
    'A': 71.0779,
    'R': 156.1857,
    'N': 114.1026,
    'D': 115.0874,
    'C': 103.1429,
    'E': 129.114,
    'Q': 128.1292,
    'G': 57.0513,
    'H': 137.1393,
    'I': 113.1576,
    'L': 113.1576,
    'K': 128.1723,
    'M': 131.1961,
    'F': 147.1739,
    'P': 97.1152,
    'S': 87.0773,
    'T': 101.1039,
    'W': 186.2099,
    'Y': 163.1733,
    'V': 99.1311
};
const hydrogenMass = 1.00784;
const hydroxylMass = 17.00274;
const amideMassAdjustment = -0.984;
/**
 * Calculates the mass of a peptide.
 *
 * @param sequence The sequence of the peptide, using one letter codes for the amino acids.
 * @param amidatedCterminus Whether the C-terminus is amidated.
 * @returns The mass of the peptide.
 */
function calculatePeptideMass(sequence, amidatedCterminus) {
    let mass = hydrogenMass + hydroxylMass;
    for (const residue of sequence) {
        const residueMass = aminoAcidMasses[residue];
        if (!residueMass) {
            return 0;
        }
        mass += residueMass;
    }
    if (amidatedCterminus) {
        mass += amideMassAdjustment;
    }
    return mass;
}
//# sourceMappingURL=extension.js.map