if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "C:/Users/SSAFY/.gradle/caches/8.10.2/transforms/cc6538d1dfd58568ef78eef8c5ee9673/transformed/fbjni-0.6.0/prefab/modules/fbjni/libs/android.x86_64/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/SSAFY/.gradle/caches/8.10.2/transforms/cc6538d1dfd58568ef78eef8c5ee9673/transformed/fbjni-0.6.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

