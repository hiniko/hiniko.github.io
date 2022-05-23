## Todo

* Single camera via camera manager in UE4

## Today I learned (Notes)

[ue-editor](../knowledge/unreal/ue-editor.md)

* Having custom editor only objects appear is quite a task overall
  
  * `CameraComponent` is a good example of how it is done in source code: 
    * `Engine\UE4\Source\Runtime\Engine\Classes\Camera\CameraComponent.h : 149`. This header contains the editor driven functions for creating an managing the proxy mesh that represents the camera positioning in the Blueprint Editor.
    * Powered by a `ProxyMeshComponent`, it is updated when `OnRegister` is called. Here a new Mesh is created, setup and other calls to update the position is called.
* Responding to changes in the is done in a few places. 
  
  * To Respond to an editor proprety change (Like a input field), use `PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)`

````
#if WITH\_EDITORONLY\_DATA  
void UCameraComponent::PostEditChangeProperty(FPropertyChangedEvent & PropertyChangedEvent)  
{  
   Super::PostEditChangeProperty(PropertyChangedEvent);  
  
   const FName PropertyName \= PropertyChangedEvent.Property ? PropertyChangedEvent.Property\->GetFName() : FName();  
   if (PropertyName \== GET\_MEMBER\_NAME\_CHECKED(UCameraComponent, bCameraMeshHiddenInGame))  
   {  
      OnCameraMeshHiddenChanged();  
   }  
  
   RefreshVisualRepresentation();  
}
#endif
````

* For `ActorComponents` Override `OnRegister` as this is called after a proprerty change

* `WITH_EDITOR` vs `WITH_EDITOR_DATA`
  
  * According to https://forums.unrealengine.com/t/with_editor-vs-with_editoronly_data-need-clarification/103182/6

````
WITH\_EDITORONLY\_DATA tells the Header tool to Add serialization code for those fields WHEN BUILDING EDITOR TIME TOOLS.

AND STRIPS the data IN SHIPPING GAME BUILDS.WITH\_EDITOR id a compiler directive. WITH\_EDITORONLY\_DATA is a header tool directive.	
````

* Component Visualisers
  * Used by components such as `USpringArmCmponent` to visualise the target arm length when selected 
    * `FComponentVisualizer` is a base class that is extended.
    * Provides a draw method that will be called in the editor when the object is selected. Here you can provide debug draw / other draw types 
    * The Visualiser has to be registered with the editor on module start up so it is best suited to be in the an Editor module 
    * https://sondreutheim.com/post/ue4_component_visualizers

## Tomorow's Tasks

* Get a base project up and to get a component visualiser up as well as try and understand how to draw and update objects in the editor after property change.
