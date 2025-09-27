#!/usr/bin/env node
'use strict';

require('dotenv').config();

const { spawnSync } = require('node:child_process');
const { env, argv, exit } = require('node:process');

if (!env.GH_PROMPT_DISABLED) {
  env.GH_PROMPT_DISABLED = '1';
}

const parseArgs = (input) => {
  const result = {};
  for (let i = 0; i < input.length; i += 1) {
    const token = input[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = input[i + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      i += 1;
    } else {
      result[key] = 'true';
    }
  }
  return result;
};

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    exit(result.status ?? 1);
  }
};

const capture = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `Command failed: ${command} ${args.join(' ')}`);
  }

  return (result.stdout || '').trim();
};

const sentencesIn = (text) => {
  return text
    .split(/[.!?]+\s*/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0).length;
};

const options = parseArgs(argv.slice(2));

const requiredKeys = ['branch', 'commit', 'title', 'summary'];
const missing = requiredKeys.filter((key) => !options[key]);

if (missing.length > 0) {
  console.error(`Missing required options: ${missing.join(', ')}`);
  console.error('Usage: npm run gh:workflow -- --branch <name> --commit <message> --title <pr title> --summary "Sentence one. Sentence two." [--mermaid "graph TD;"] [--base main]');
  exit(1);
}

if (!env.GITHUB_TOKEN) {
  console.error('GITHUB_TOKEN is required for GitHub CLI authentication.');
  exit(1);
}

if (!env.GITHUB_REPOSITORY) {
  console.error('GITHUB_REPOSITORY must be set (e.g. owner/repo).');
  exit(1);
}

const summary = options.summary.trim();
const sentenceCount = sentencesIn(summary);

if (sentenceCount < 2 || sentenceCount > 6) {
  console.error('Summary must contain between 2 and 6 sentences.');
  exit(1);
}

const baseBranch = options.base || 'main';
const targetBranch = options.branch;
const repo = env.GITHUB_REPOSITORY;

const ghEnv = {
  ...env,
  GH_TOKEN: env.GITHUB_TOKEN,
};

const status = capture('git', ['status', '--porcelain']);
if (!status) {
  console.error('There are no changes to commit.');
  exit(1);
}

let branchExists = false;
try {
  capture('git', ['rev-parse', '--verify', targetBranch]);
  branchExists = true;
} catch (error) {
  branchExists = false;
}

if (branchExists) {
  run('git', ['switch', targetBranch]);
} else {
  run('git', ['switch', '-c', targetBranch]);
}

run('git', ['add', '-A']);

run('git', ['commit', '-m', options.commit]);

run('git', ['push', '-u', 'origin', targetBranch]);

const bodyParts = [summary];
if (options.mermaid) {
  bodyParts.push('```mermaid\n' + options.mermaid.trim() + '\n```');
}
const prBody = bodyParts.join('\n\n');

run('gh', ['pr', 'create', '--title', options.title, '--body', prBody, '--head', targetBranch, '--base', baseBranch, '--repo', repo], { env: ghEnv });

const prInfoRaw = capture('gh', ['pr', 'view', targetBranch, '--json', 'number', '--repo', repo], { env: ghEnv });
const prNumber = JSON.parse(prInfoRaw).number;

run('gh', ['pr', 'review', String(prNumber), '--approve', '--repo', repo], { env: ghEnv });

run('gh', ['pr', 'merge', String(prNumber), '--squash', '--delete-branch', '--repo', repo], { env: ghEnv });

run('git', ['switch', baseBranch]);
run('git', ['pull', '--ff-only', 'origin', baseBranch]);

const localBranches = capture('git', ['branch', '--list', targetBranch]);
if (localBranches) {
  run('git', ['branch', '-D', targetBranch]);
}

console.log(`Merged PR #${prNumber} into ${baseBranch} and cleaned up ${targetBranch}.`);
