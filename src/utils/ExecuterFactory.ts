import cppExecuter from "../containers/cppExecuter";
import javaExecuter from "../containers/javaExecuter";
import pythonExecuter from "../containers/pythonExecuter";
import CodeExecuterStrategy from "../types/CodeExecuterStrategy";

export default function createExecuter(codeLanguage: string): CodeExecuterStrategy | null {
    switch (codeLanguage) {
        case "PYTHON":
            return new pythonExecuter();
        case "CPP":
            return new cppExecuter();
        case "JAVA":
            return new javaExecuter();
        default:
            return null;
    }
}