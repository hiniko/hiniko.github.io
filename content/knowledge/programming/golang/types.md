---
title: Golang - Types
date: ""
tags:
  - ""
  - ""
keywords:
  - ""
  - ""
description: ""
---

# Types in golang

(Stack Overflow Answer)\[https://stackoverflow.com/a/47399371\]

Similar to C/C++ you can declare types 

````go
type Tuple struct {
	X, Y, Z, W float64
}
````

You can also decalre alias 

````go
type Foo String

var bar Foo = "FooString"
````

However it is important to note that Foo and string are now two different types. Since 1.9 you are able to tell the compiler that a type alias is *just* another name but should be considered the same type overall.

````go
type Tuple struct {
	X, Y, Z, W float64
}

type Point = Tuple
type Vector = Tuple


func NewTuple(x, y, z, w float64) *Tuple {
	t := new(Tuple)

	t.X = x
	t.Y = y
	t.Z = z
	t.W = w

	return t
}

func NewPoint(x, y, z float64) *Point {
	return NewTuple(x, y, z, 0)
}

func NewVector(x, y, z float64) *Vector {
	return NewTuple(x, y, z, 1)
}````
