---
title: Golang - Basics
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Basic Language Usage

Basic things to remember while bouncing around lanaguages

## Slices / Arrays

Arrays exist in Golang and can be created manually:

However nearly all usages of arrays are through slices, which are built on top of arrays, providing a view in to a backing array.

Some things to keep in mind:

* Changing a value in a slice changes the value in the backing array 
* Ranges can be used on slices: `slice[1:5], slice[:2], slice[2:]`
* A slice can be resized to reflect more or less of the underlaying array, through assignment: `slice = slice[:cap(slice)]`
* Resizing a slice past the capacity of the array will throw a panic

### Compose Literals

You can define an array of basic types use a `compose literal` like so:

````go
mat := [][]int32{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}, {13, 14, 15, 16}}

````

### Sorting

Pacakge `sort` is available, with common sorting functions for slices

* A sorting algorithm is can be supplied using `sort.Slice`

````go
var arr = []int32{1, 4, 2, 9, 3, 8, 7, 6, 10, 5}
sort.Slice(arr, func(i, j int) bool { return arr[i] < arr[j] })
````

## Control Flow

### `switch`

* `case` statements with switches do not fall through, as with other C style languages!
* `default` is supported
* `switch` can be used with or without and argument
* `case` can evaluate expressions

````go
var i = 123
switch(i){
	case 10: fmt.println("Fail")
	case 123: fmt.println("OK")
	case 456: fmt.println("Fail")
}

switch {
	case i==10: fmt.println("Fail")
	case i<123: fmt.println("OK")
	case i>456: fmt.println("Fail")
	default: fmt.println("Who knows?")
}
````

### `for`

* You can do multiplie assignments of variables of in a for loop if you're into that kind of thing

````go
 for i,j := low, high; low != mid && high != mid; i,j = i+1, j-1 {
	// Code
 }
````

## Number conversion

### Floats to ints and back

````go
package main

import "fmt"

func main() {
	var i = 123
	var f = 1.23
	fmt.Printf("%.5f\n", float64(i))
	fmt.Printf("%d\n", int(f))
}
````

Result: 

````
123.00000
1  Program exited.
````

Note the ususal issue with truncating a float to an int based number, possible unexpected rounding errors.
