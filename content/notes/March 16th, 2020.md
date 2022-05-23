* [java](../knowledge/programming/java/java.md)
  * Something to watch out for in future when trying to get the parameterized type from a class, i.e the `SomeOtherClass` from `Class<SomeOtherClass>`
    * Getting the type is easy, especially if you only have one type:

````java
public Type getType() {
	return ((ParameterizedType) getClass()
			.getGenericSuperclass()).getActualTypeArguments()[0];
}
````

* Watch out for calling `Type.getClass()` as you will not get the class you were expecting, but the class that represents the instance of the `Type` class
  * `Type` itself is an interfaces that `Class` implements, so it should be OK to pass the type instance to places you would pass classes
