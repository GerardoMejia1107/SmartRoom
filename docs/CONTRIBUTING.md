# Contributing to SmartRoom

Thank you for your interest in contributing to SmartRoom! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors. Please:

- Be respectful and considerate in your communications
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for your mistakes and learn from them

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. Read the [README.md](../README.md) for project overview
2. Set up your development environment following [SETUP.md](./SETUP.md)
3. Understood the [ARCHITECTURE.md](./ARCHITECTURE.md) and [TECHNICAL.md](./TECHNICAL.md)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SmartRoom.git
   cd SmartRoom
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/GerardoMejia1107/SmartRoom.git
   ```

---

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**: Fix issues and improve stability
- ✨ **New features**: Add new functionality
- 📚 **Documentation**: Improve or add documentation
- 🧪 **Tests**: Add or improve test coverage
- 🎨 **UI/UX**: Improve the user interface
- ⚡ **Performance**: Optimize code and improve performance
- 🔒 **Security**: Fix security vulnerabilities

### Finding Issues to Work On

- Check the [Issues](https://github.com/GerardoMejia1107/SmartRoom/issues) page
- Look for issues labeled `good first issue` for beginners
- Issues labeled `help wanted` need community assistance
- Feel free to ask questions on any issue before starting work

---

## Development Workflow

### 1. Create a Branch

Create a descriptive branch for your work:

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b <type>/<description>
```

### Branch Naming Convention

Use the following prefixes:

| Prefix | Description | Example |
|--------|-------------|---------|
| `feature/` | New feature | `feature/add-temperature-alerts` |
| `fix/` | Bug fix | `fix/sensor-reading-null` |
| `docs/` | Documentation | `docs/update-api-reference` |
| `refactor/` | Code refactoring | `refactor/mqtt-client` |
| `test/` | Adding tests | `test/user-controller` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Backend
cd backend
npm run lint  # If configured
npm test      # If tests exist

# Frontend
cd frontend
npm run lint
npm run build  # Ensure build succeeds
```

### 4. Commit Your Changes

Follow the commit message guidelines below.

### 5. Push and Create PR

```bash
git push origin <your-branch-name>
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable and function names
- Prefer `const` over `let`; avoid `var`
- Use async/await over callbacks or raw promises
- Handle errors appropriately

**Example:**
```typescript
// Good
const fetchSensorData = async (sensorId: string): Promise<ISensor | null> => {
  try {
    const sensor = await Sensor.findById(sensorId);
    return sensor;
  } catch (error) {
    console.error('Failed to fetch sensor:', error);
    return null;
  }
};

// Avoid
function fetchSensorData(sensorId, callback) {
  Sensor.findById(sensorId, function(err, sensor) {
    callback(err, sensor);
  });
}
```

### React/Frontend

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Extract reusable logic into custom hooks

**Example:**
```tsx
interface SensorCardProps {
  sensor: ISensor;
  onRefresh: () => void;
}

const SensorCard: React.FC<SensorCardProps> = ({ sensor, onRefresh }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3>{sensor.source}</h3>
      <p>Temperature: {sensor.temperature_c}°C</p>
      <button onClick={onRefresh}>Refresh</button>
    </div>
  );
};
```

### Arduino/C++

- Use descriptive constant names
- Comment complex logic
- Follow existing formatting patterns
- Avoid blocking operations in loop()

---

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |

### Scopes

| Scope | Description |
|-------|-------------|
| `backend` | Backend API changes |
| `frontend` | Frontend changes |
| `firmware` | ESP8266 firmware |
| `docs` | Documentation |
| `deps` | Dependencies |

### Examples

```bash
# Feature
feat(backend): add temperature threshold alerts

# Bug fix
fix(frontend): resolve sensor chart rendering issue

# Documentation
docs: update API reference with new endpoints

# Refactoring
refactor(backend): extract MQTT logic into separate module

# Dependencies
chore(deps): update mongoose to version 8.x
```

### Subject Guidelines

- Use imperative mood ("add" not "added")
- Don't capitalize the first letter
- No period at the end
- Keep it under 72 characters

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code for obvious errors
- [ ] Added/updated tests (if applicable)
- [ ] Updated documentation (if applicable)
- [ ] All tests pass locally
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Title

Follow the same format as commit messages:
```
feat(backend): add user authentication
```

### PR Description Template

```markdown
## Description
[Describe what this PR does]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #[issue_number]

## Testing
[Describe how to test the changes]

## Checklist
- [ ] My code follows the project style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] I have updated the documentation
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR

### After Merge

- Delete your branch
- Pull the latest changes to your local main branch

---

## Issue Guidelines

### Reporting Bugs

Use the bug report template when creating issues:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node.js version: [e.g., 18.17.0]

**Additional context**
Any other relevant information.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

---

## Testing

### Backend Testing

When adding tests for the backend:

```typescript
// Example test structure
import request from 'supertest';
import app from '../app';

describe('Sensors API', () => {
  describe('GET /api/sensors', () => {
    it('should return all sensors', async () => {
      const response = await request(app)
        .get('/api/sensors')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/sensors', () => {
    it('should create a new sensor reading', async () => {
      const sensorData = {
        temperature_c: '25.5',
        humidity_pct: '60.0',
        light_pct: '45',
        low_light: false,
        motion: false
      };

      const response = await request(app)
        .post('/api/sensors')
        .send(sensorData)
        .expect(201);
      
      expect(response.body.temperature_c).toBe('25.5');
    });
  });
});
```

### Frontend Testing

When adding tests for the frontend:

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import SensorCard from './SensorCard';

describe('SensorCard', () => {
  const mockSensor = {
    _id: '123',
    temperature_c: '25.5',
    humidity_pct: '60.0',
    light_pct: '45',
    low_light: false,
    motion: false,
    source: 'esp8266-B'
  };

  it('renders sensor data correctly', () => {
    render(<SensorCard sensor={mockSensor} />);
    
    expect(screen.getByText('25.5°C')).toBeInTheDocument();
    expect(screen.getByText('esp8266-B')).toBeInTheDocument();
  });
});
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing API endpoints
- Modifying configuration options
- Updating dependencies
- Changing architecture

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and quick start |
| `docs/TECHNICAL.md` | Technical details and specifications |
| `docs/ARCHITECTURE.md` | System architecture |
| `docs/SETUP.md` | Development setup guide |
| `docs/API.md` | API reference |
| `docs/CONTRIBUTING.md` | Contribution guidelines |
| `docs/CHANGELOG.md` | Version history |

### Documentation Style

- Use clear, concise language
- Include code examples where helpful
- Keep formatting consistent
- Update the "Last updated" date

---

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search existing issues
3. Open a new issue with your question

Thank you for contributing to SmartRoom! 🏠💡

---

*Last updated: December 2024*
