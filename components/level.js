//@ts-check
import Rectangle from "./rectangle.js";

export default class Level {
    #backgroundHeight = 150;
    #backWallHeight = 250;
    #forgroundWallHeight = 500;
    #boundryWidth = 10;
    
    constructor() {
        this.levelName = "Level 1";
        this.floorHeight = 50;
        this.width = 2000;
        this.height = 600;
        this.skybox = new Rectangle(0, 0, this.width, this.height, "#888");
        this.background = new Rectangle(0, this.height - this.#backgroundHeight, this.width, this.#backgroundHeight, "#555");
        this.backWall = [
            new Rectangle(0, this.height - this.#backWallHeight, 10, this.#backWallHeight, "#222"),
            new Rectangle(191, this.height - this.#backWallHeight, 5, this.#backWallHeight, "#222"),
            new Rectangle(382, this.height - this.#backWallHeight, 10, this.#backWallHeight, "#222"),
            new Rectangle(573, this.height - this.#backWallHeight, 5, this.#backWallHeight, "#222"),
            new Rectangle(764, this.height - this.#backWallHeight, 10, this.#backWallHeight, "#222"),
            new Rectangle(955, this.height - this.#backWallHeight, 5, this.#backWallHeight, "#222"),
            new Rectangle(1146, this.height - this.#backWallHeight, 10, this.#backWallHeight, "#222"),
            new Rectangle(1337, this.height - this.#backWallHeight, 5, this.#backWallHeight, "#222"),
            new Rectangle(1528, this.height - this.#backWallHeight, 10, this.#backWallHeight, "#222"),
            new Rectangle(1719, this.height - this.#backWallHeight, 5, this.#backWallHeight, "#222"),
            new Rectangle(1910, this.height - this.#backWallHeight, 10, this.#backWallHeight, "#222")
        ];
        this.levelData = [
            new Rectangle(0, this.height - this.floorHeight, this.width, this.floorHeight, "#111"),
            new Rectangle(this.width * 0.5, this.height - this.floorHeight - 40, 150, 40, "#111"),
            new Rectangle(0, 0, this.#boundryWidth, this.height, "#111"),
            new Rectangle(this.width - this.#boundryWidth, 0, this.#boundryWidth, this.height, "#111"),
            new Rectangle(500, this.height - 200, 200, 20, "green")
        ];
        this.forground = [
            // new Rectangle(0, this.height - this.#forgroundWallHeight, 45, this.#forgroundWallHeight, "#000"),
            new Rectangle(291, this.height - this.#forgroundWallHeight, 20, this.#forgroundWallHeight, "#000"),
            new Rectangle(582, this.height - this.#forgroundWallHeight, 45, this.#forgroundWallHeight, "#000"),
            new Rectangle(873, this.height - this.#forgroundWallHeight, 20, this.#forgroundWallHeight, "#000"),
            new Rectangle(1164, this.height - this.#forgroundWallHeight, 45, this.#forgroundWallHeight, "#000"),
            new Rectangle(1455, this.height - this.#forgroundWallHeight, 20, this.#forgroundWallHeight, "#000"),
            new Rectangle(1746, this.height - this.#forgroundWallHeight, 45, this.#forgroundWallHeight, "#000")
        ];
    }

}