const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

const filePath = path.join(__dirname, 'tasks.txt');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loadTasks() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf8');
}

function addTask() {
    rl.question(chalk.blue('Enter the task: '), (task) => {
        const tasks = loadTasks();
        tasks.push({ task, completed: false });
        saveTasks(tasks);
        console.log(chalk.bgYellow('Task added successfully!'));
        rl.close();
    });
}

function viewTasks(callback) {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log(chalk.red('No tasks found.'));
    } else {
        console.log(chalk.yellow('\nTask List:'));
        tasks.forEach((t, index) => {
            console.log(chalk.yellow(`${index + 1}. ${t.completed ? chalk.green('[✓]') : chalk.red('[ ]')} ${t.task}`));
        });
    }
    if (callback) callback();
}

function markTaskComplete() {
    viewTasks(() => {
        rl.question(chalk.blue('\nEnter task number to mark as complete: '), (num) => {
            const tasks = loadTasks();
            const index = parseInt(num) - 1;
            if (tasks[index]) {
                tasks[index].completed = true;
                saveTasks(tasks);
                console.log(chalk.green('Task marked as complete!'));
            } else {
                console.log(chalk.red('Invalid task number.'));
            }
            rl.close();
        });
    });
}

function removeTask() {
    viewTasks(() => {
        rl.question(chalk.blue('\nEnter task number to remove: '), (num) => {
            const tasks = loadTasks();
            const index = parseInt(num) - 1;
            if (tasks[index]) {
                tasks.splice(index, 1);
                saveTasks(tasks);
                console.log(chalk.bgRedBright('Task removed successfully!'));
            } else {
                console.log(chalk.red('Invalid task number.'));
            }
            rl.close();
        });
    });
}

console.log(chalk.cyan('\nChoose an operation:'));
console.log(chalk.cyan('1. Add a new task'));
console.log(chalk.cyan('2. View tasks'));
console.log(chalk.cyan('3. Mark task as complete'));
console.log(chalk.cyan('4. Remove a task'));

rl.question(chalk.blue('\nEnter your choice: '), (choice) => {
    switch (choice) {
        case '1':
            addTask();
            break;
        case '2':
            viewTasks(() => rl.close());
            break;
        case '3':
            markTaskComplete();
            break;
        case '4':
            removeTask();
            break;
        default:
            console.log(chalk.red('Invalid choice.'));
            rl.close();
    }
});


// completed  now