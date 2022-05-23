* \#vscode Focusing terminal keyboard shortcut
  * https://github.com/Microsoft/vscode/issues/12054
  * In Keyboard shortcuts:
    * `workbench.action.terminal.focus  [ctrl] + [shift] + #`
    * `workbench.action.focusActiveEditorGroup  [ctrl] + [shift] + # when terminalFocus`
    * This makes a switchable key from terminal to editor
* \#Gradle Jar building + multi sourceset configuration
  * Below is an example of using the class path of another source set when defining a new one, you could also use `toolsImplementation sourceSets.main.runtimeClasspath` but I feel it makes more sense in the source set configuration

````groovy
    tools {
      java {
        srcDirs = ["src-tools"]	
              exclude "resources/"
      }
   		resources {
   			srcDirs = ["src-tools/resources"]	
   		}
      compileClasspath += sourceSets.main.runtimeClasspath
    }
````
