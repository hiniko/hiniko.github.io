## Todo

* Continue work on Camera Manager Implementation

## Today I learned (Notes)

### Abstract Classes in  #cpp

* Abstract classes in #cpp are a bit more implicit than other languages 
  * https://en.cppreference.com/w/cpp/language/abstract_class
  * A `class` / `struct` becomes abstract when it has a virtual member that is `= 0` making it a *pure virtual*. Any calls to this should fail at *runtime*. 
  * Example from the above link:

````c++
struct Base { virtual int g(); virtual ~Base() {} };
struct A : Base {
    // OK: declares three member virtual functions, two of them pure
    virtual int f() \= 0, g() override \= 0, h();
    // OK: destructor can be pure too
    ~A() \= 0;
    // Error: pure-specifier on a function definition
    virtual int b()\=0 {}
};
````

### Camera Control in #unreal

* Understood a bit more about how the camera manager framework is put together. More notes over at [ue-cameras](../knowledge/unreal/ue-cameras.md)

## Tomorow's Tasks
