# ProMass

**ProMass** is a sleek and efficient Visual Studio Code extension for calculating the average mass of peptide sequences in any file. Designed for researchers, chemists, and bioinformaticians, it ensures you get quick and accurate results directly within your editor. You will notice the convenience very quickly, I promise! ;)


## Features

- **Real-Time Calculations**: Displays the average mass of selected peptide sequences in the status bar.
- **Customizable Settings**:
  - Adjust the update interval to suit your workflow.
  - Option to toggle amidated C-terminus calculations.
- **Simple and Intuitive**: No distractions — just select a valid sequence to see its mass.


## How to Use

1. Select a peptide sequence in any text file.
   - Example: `ACDEFGHIKLMNPQRSTVWY`
2. Check the status bar (bottom-right) for the calculated mass.
3. Configure the extension via VSCode settings:
   - **Update Interval**: Customize the calculation delay.
   - **Amidated C-Terminus**: Toggle amidation adjustments for peptide mass.


## Settings

| Setting                                   | Default | Description                                       |
|-------------------------------------------|---------|---------------------------------------------------|
| `proteinMassCalculator.updateInterval`    | `1000`  | Update interval for calculations (ms).            |
| `proteinMassCalculator.amidatedCterminus` | `false` | If true, calculates mass for amidated C-terminus. |


## Examples

| Sequence                 | Amidated | Mass          |
|--------------------------|----------|---------------|
| `ACDEFGHIKLMNPQRSTVWY`   | No       | `2395.72 Da`  |
| `ACDEFGHIKLMNPQRSTVWY`   | Yes      | `2394.74 Da`  |


## Why ProMass?

- Streamlined for peptide sequence calculations.
- Perfect for bioinformatics workflows.
- Lightweight, accurate, and customizable.


## Feedback

I value your feedback! Please report issues or suggest features via the [GitHub repository](https://github.com/ulrichpabst/ProMass).
