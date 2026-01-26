/**
 * Test file for VS Roast Extension
 * This file contains various code patterns that should trigger roasts
 */

// ❌ var usage (should be roasted)
var oldSchoolVariable = "I'm living in the past";
var anotherOne = 42;

// ❌ console.log (should be roasted)
console.log("Debugging like it's 1999");
console.log(oldSchoolVariable);

// ❌ any type (should be roasted)
function processData(data: any): any {
    return data;
}

// ❌ TODO comments (should be roasted)
// TODO: Refactor this function
// TODO: Add error handling
// TODO: Write tests

// ❌ Loose equality (should be roasted)
if (5 == "5") {
    console.log("Type coercion for the win!");
}

// ❌ eval usage (should be roasted)
const code = "console.log('danger')";
eval(code);

// ❌ Empty catch block (should be roasted)
try {
    throw new Error("Something went wrong");
} catch (error) { }

// ❌ Deep nesting (should be roasted)
function pyramidOfDoom() {
    if (true) {
        if (true) {
            if (true) {
                if (true) {
                    console.log("We need to go deeper!");
                }
            }
        }
    }
}

// ❌ Multiple anti-patterns in one function
function terribleFunction(input: any) {
    var result = null;

    // TODO: This needs work
    console.log("Starting terrible function");

    if (input == undefined) {
        if (result == null) {
            if (true) {
                console.log("So many issues");
                var nested = "deeply nested var";
                return nested;
            }
        }
    }

    return result;
}

// ✅ Good code (should NOT be roasted)
const goodVariable = "I'm modern!";
let mutableVariable = 42;

function goodFunction(data: string): string {
    if (data === "") {
        return "empty";
    }
    return data.toUpperCase();
}

// ✅ Proper error handling
try {
    throw new Error("Handled properly");
} catch (error) {
    console.error("Error caught:", error);
}

// ❌ More roast-worthy code
var x = 1, y = 2, z = 3;
console.log(x, y, z);

function anotherBadOne(param: any): any {
    // TODO: Implement this
    console.log("Not implemented yet");
    return param;
}

// Test the extension by opening this file in VS Code!
// You should see grey italic roast comments appearing to the right of problematic code.
