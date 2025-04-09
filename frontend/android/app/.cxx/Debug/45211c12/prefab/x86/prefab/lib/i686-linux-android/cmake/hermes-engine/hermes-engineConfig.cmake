if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/SSAFY/.gradle/caches/8.10.2/transforms/d8197d9eced7013980f2241d373d872c/transformed/hermes-android-0.76.7-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/SSAFY/.gradle/caches/8.10.2/transforms/d8197d9eced7013980f2241d373d872c/transformed/hermes-android-0.76.7-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

