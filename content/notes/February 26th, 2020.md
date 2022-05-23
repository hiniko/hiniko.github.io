* [kotlin](../knowledge/programming/kotlin/kotlin.md)
  * Including Kotlin in to an existing project 
    
    * https://kotlinlang.org/docs/reference/using-gradle.html#plugin-and-versions
    * Add the `gradle-kotlin` plugin, add a source set config
      * Kotlin through #gradle seems to work with their instructions with no issue
    * IDE Support
      * \#vscode 
        * There is a Kotlin plugin, however current it doesn't support using java in Kotlin https://github.com/fwcd/kotlin-language-server/issues/192 this is a must for interop programming
        * Errors about unresolved classes for the java stdlib (e.g. `Object`)
      * \#Eclipse Eclipse has a plugins from #JetBrains themselves however I wasn't able to get the interop working propertly either. 
        * I could import #shermans_notes/knowledge/programming/java/\_index to #kotlin however not the other way around.
        * had issues with compilation / recompilation of Kotlin files  after certain ops, like file name / class changes
        * couldn't run main #kotlin files either.
        * Errors about unresolved classes for the java stdlib (e.g. `Object`)
      * \#IntelliJ
        * This being a #JetBrain product as well, it just worked.
  * Imported our gradle project and got off the bat right away no class path issues.
