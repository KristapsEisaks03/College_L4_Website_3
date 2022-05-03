function MoveWebsite(Page_location){
    var MainFrame = document.getElementById("Main_Body_iFrame");
    MainFrame.classList.remove("Main_Body_iFrame_Anim_Class");
    void MainFrame.offsetWidth;
    MainFrame.classList.add("Main_Body_iFrame_Anim_Class");

    MainFrame.src = Page_location;
}

