---
title: Lonely Integer - XOR Integer Pairs
date: ""
tags:
  - programming
  - challanges
  - golang
description: The quickest way to solve the lonely Integer problem
---

# Lonely Integer - XOR Integer Pairs

*From Hacker Rank, Lonely Integer Challange*

Taking an array of integers, where it a guarenteed that the size is odd, and all enteries bar one is a pair, return the integer that only appears once.

I knew there must be a trick to this however I didn't figure it out. I implemented a basic solution using a map to count instances which was obviously O(N) in time.

````go
count := make(map[int32]int)

 for i:=0; i < len(a); i++ {

	 count[a[i]]++

 } 

 for k,v := range count {

	 if(v == 1){
	
	 return int32(k)
	
	 } 

 }

 return -1
````

However since there are always pairs of numbers, it is much faster to do a bitwise XOR operation, as the pairs of numbers. As a small proof:

````shell
1 0001					4 0100
2 0010 ^= 0011			5 0101 ^= 0001
3 0011 ^= 0000			3 0011 ^= 0010
2 0010 ^= 0010			3 0011 ^= 0001
1 0001 ^= 0011			5 0101 ^= 0100

r = 0011 = 3			r = 0100 = 4
````

So the resulting code will be much quicker and easier 

````go
 var r int32 = 0

 for i:=0; i < len(a); i++ {

	 r ^= a[i]

 } 

 return r
````
